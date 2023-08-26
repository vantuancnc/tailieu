 import Editor from '../../../../../../../ckeditor/build/ckeditor';
import { cssPrint } from 'src/app/share/common/cssPrint';
//intall ckediter angular
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-',
  templateUrl: './add-print',
  styleUrls: ['./add-print'],
})
export class AddPrintFormComponent implements OnInit {

  public Editor = Editor;
  public submited = false;
  public showElm = false;
  public listAllElement = []
  public urlImg =
    '<figure class="image ck-widget" contenteditable="false"><img src="https://ckeditor.com/docs/ckeditor5/latest/assets/img/fields.jpg" alt="Autumn fields"><div class="ck ck-reset_all ck-widget__type-around"><div class="ck ck-widget__type-around__button ck-widget__type-around__button_before" title="Insert paragraph before block" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 8"><path d="M9.055.263v3.972h-6.77M1 4.216l2-2.038m-2 2 2 2.038"></path></svg></div><div class="ck ck-widget__type-around__button ck-widget__type-around__button_after" title="Insert paragraph after block" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 8"><path d="M9.055.263v3.972h-6.77M1 4.216l2-2.038m-2 2 2 2.038"></path></svg></div><div class="ck ck-widget__type-around__fake-caret"></div></div></figure>';
  public editorInstance;
  public itemsToobar = [
    'undo',
    'redo',
    'heading',
    'lineHeight',
    'alignment',
    // 'blockQuote',
    'restrictedEditingException',
    'specialCharacters',
    'link',
    'fontBackgroundColor',
    'fontColor',
    'fontFamily',
    'fontSize',
    'indent',
    'outdent',
    'italic',
    'underline',
    'bold',
    'numberedList',
    'bulletedList',
    // 'mediaEmbed',
    'strikethrough',
    'insertTable',
    'todoList',
    'findAndReplace',
    'highlight',
    'horizontalLine',
    'imageUpload',
    'pageBreak',
    'selectAll',
    'subscript',
    'superscript',
  ];


  onReady(editor) {
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }

  constructor(private fb: UntypedFormBuilder,private __formBuilderService: FormBuiderService,private _ShareService: ShareService) {
    //thêm font
    //   this.Editor.defaultConfig.fontFamily = {
    //     options: [
    //         'default',
    //         'Ubuntu, Arial, sans-serif',
    //         'Ubuntu Mono, Courier New, Courier, monospace'
    //     ]
    // },
   
    // cấu hình cho phép thêm thẻ và các atribute
    this.Editor.defaultConfig.htmlSupport ={
      allow: [
          {
              name: /.*/,
              attributes: true,
              classes: true,
              styles: true
          }
      ]
  }
    this.Editor.allowedContent = true,
    this.Editor.extraAllowedContent = 'span[*]{*};'
    // cấu hình font
    this.Editor.defaultConfig.fontSize = {
      options: [
        9,
        11,
        13,
        'default',
        17,
        19,
        21,
        23,
        25,
        30
      ]
    },
    this.Editor.defaultConfig.image ={
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side'
      ]
    }
  }

 drag(item,ev): void {
    //ev.dataTransfer.setData('text', ' ${' + ev.target.innerText + '} ');
    let str = `<span class='sp_print' title="${item.element.label}">{{${item.element.field_name}}}</span>&nbsp;`
    ev.dataTransfer.setData('text/html', str);
  }
  
  allowDrop(ev): void {
    ev.preventDefault();
  }

  getValueE(e) {
    console.log(e); 
  }



  previewPrint() {
    let params = 'width=' + screen.width;
    params += ', height=' + screen.height;
    params += ', top=0, left=0';
    params += ', fullscreen=yes';
    params += ', directories=no';
    params += ', location=no';
    params += ', menubar=no';
    params += ', resizable=no';
    params += ', scrollbars=no';
    params += ', status=no';
    params += ', toolbar=no';
    let css = new cssPrint();
    let mywindow = window.open('', 'Print', params);
    mywindow.document.write('<head>');
    mywindow.document.write('<title>Xem trước mẫu in</title>');
    mywindow.document.write(
      `<style type="text/css">
           ${css.PrintCSS}
        </style>`
    );
    mywindow.document.write('</head><body >');
    mywindow.document.write(this.form.value.dataEditer);
    mywindow.document.write('</body></html>');
    setTimeout(function () {
      mywindow.print();
      mywindow.close();
      this.showPrint = false;
    }, 10);
    return true;
  }
  onSubmit(){
 
  }

  drop(ev): void {
    console.log(ev);
    
    ev.preventDefault();
    const data = ev.dataTransfer.getData('dragElement');
    const dataValue = 'a';

    const startPos = ev.target.selectionStart;
    const endPos = ev.target.selectionEnd;
    console.log(ev);
    
    ev.target.value = ev.target.value.substring(0, startPos)
      + dataValue
      + ev.target.value.substring(endPos, ev.target.value.length);
  }
}

<!----html-->
   <ckeditor
          (drop)="drop($event)"
          (dragover)="allowDrop($event)"
          (ready)="onReady($event)"
          [editor]="Editor"
          [config]="{ toolbar: this.itemsToobar }"
          formControlName="dataEditer"
        >
        </ckeditor>
