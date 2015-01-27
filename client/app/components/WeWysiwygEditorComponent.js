/**
 * WeWysiwygEditorComponent editor html for we.js
 */

App.WeWysiwygEditorComponent = Ember.Component.extend({

  chageEventName: 'onChangeText',
  pasteEventName: 'onPasteText',

  editor: {},
  //onPaste: 'onPaste',
  tagName: 'div',
  //flags
  isLoading: false,

  // focus on start
  focus: false,

  // full | small | clean
  style: 'full',

  lang: 'pt-BR',

  // Expose component to delegate's controller
  init: function() {
     this._super.apply(this, arguments);

     if (this.get('delegate')) {
        this.get('delegate').set(this.get('property') || 'WeEditor', this);
     }
  },

  didInsertElement: function() {
    this._super();

    var self = this;
    var value = self.get('value');
    if (!value) value = '';

    // append summernote div tag for create the editor in it
    self.$().append('<div class="summernote">'+value+'</div>');
    // set toobar buttons based on style config
    var toobar = [['font', ['bold', 'italic', 'underline', 'clear']]];
    if (self.get('style' ) == 'full' ) {
      toobar.push(['para', [ 'ul','ol', 'paragraph' ]]);
      toobar.push(['style', ['style']]);
      toobar.push(['insert', ['link', 'picture', 'video']]);
      toobar.push(['misc', ['fullscreen', 'help']]);
    } else if (self.get('style' ) == 'clean' ) {
      toobar = [];
    }

    var editorConfigs = {
      lang: this.get('lang'),
      focus: this.get('focus'),
      styleWithSpan: false,
      toolbar: toobar,
      onblur: function() {
        self.set('value',editor.code());
      },
      onImageUpload: function(files, editor, welEditable) {
        console.warn('onImageUpdateEditor', files, editor, welEditable);

        editor.insertImage(welEditable, url);
      }
    };

    // make on change event optional
    if (this.get('onChangeText')) {
      editorConfigs.onkeyup = function onkeyup(e) {
        // on keyUp update the binded value variable
        self.sendAction('chageEventName', editor, e);
      };
    }


    editorConfigs.onChange = function onChange(contents) {
      self.set('value', contents );
    }


    // make on paste event optional
    if (this.get('onPasteText')) {
      editorConfigs.onpaste = function onpaste() {
        self.sendAction('pasteEventName', editor );
      };
    }

    // create the editor
    var editor =  self.$('.summernote').summernote(editorConfigs);
    // get summernote visible editor
    var visibleEditor = editor.next().find('div.note-editable');

    // use at.js to add mention suport for text editor
    if (visibleEditor && visibleEditor.atwho) {
      var mentionOptions = [];
      if (App.get('currentUser.mentionOptions')) {
        mentionOptions = App.get('currentUser.mentionOptions').map(
          function(c) {
            var name = Ember.get(c, 'name');
            if (!name) name = Ember.get(c, 'contactUser.username');
            return {
              id: Ember.get(c, 'id'),
              name: name
            }
          }
        );
      }

      visibleEditor.atwho({
        at: '@',
        data: mentionOptions
      });
    }

    // salve editor on ember component variable
    this.set('editor', editor);
  },

  // on destroy remove the editor
  willDestroyElement: function() {
    this._super();
    this.get('editor').destroy();
  },

  empty: function(){
    this.get('editor').code('');
  }

});

App.WeEditorComponent = App.WeWysiwygEditorComponent.extend();