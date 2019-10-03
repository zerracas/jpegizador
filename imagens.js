/* Lucas Vinicius de Jesus Costa
 * MfdsTech
 * 09/08/2019
 * Conjunto de funções de compressão de imagem para envio ao servidor
 * 
 * Uso: 
	 * chamar a função retornaArquivo(idImagem) onde idImagem = id do elemento imagem, 
	 * com o elemento desejado como parâmetro.
	 * O elemento usado deve ser uma imagem ou um arquivo de imagem utilizado como input.
	 * O retorno da função é do tipo FILE, que poderá então ser usada 
	 * na função de Ajax (ssBuscaAjax por exemplo) como conteúdo.
	 * Por exemplo, um programa abc123aj.htm receberá como parâmetro de salvar no servidor o nome da 
	 * imagem a própria imagem, como arquivo file,
	 * para então ser codificado em binário (conteudoBinary(#)). 
	 * No JavaScript do programa solicitante, poderá ser utilizado o retorno
	 * do método geraArquivoReduzido diretamente na atribuição de valor ao conteúdo[#].
	 * 
	 * Também é possível retornar apenas o elemento blob para a função, 
	 * como conteúdo [4] = dataURItoBlob(dataURL). Depois, normalmente chamar
	 * basebusca, solicitante etc etc.
	 * 
	 * Caso não seja possível adquirir um elemento do tipo "imagem" para a utilização da função
	 * retornaArquivo(), deve-se criar um campo do tipo <img> invisível que receba a imagem em questão.
 *
*/

function comprimirArquivo(loadedData, max_size) {
   var mime_type = "image/jpeg";
   if (typeof output_format !== "undefined" && output_format == "png") {
     mime_type = "image/png";
   }
   // cria um objeto de imagem para a imagem comprimida não herdar o estilo css da imagem base
   var img = new Image();
   img.src = loadedData.src;

   var cvs = document.createElement('canvas');
   var q = 0.55;

   /***
   var q;
   // testa as dimensões da imagem para decidir a proporção da compressão
   if (img.width > 1920 || img.width > Math.round(img.height / 2.6))
	  cvs.width = img.width / 1.2;
   	  q = 0.55;
   if (img.height > 1920 || img.height > Math.round(img.width / 2.6))
	  cvs.height = img.height / 1.2;
   	  q = 0.55;
   if (img.width < 1920 || img.height < 1920) {
	  cvs.width = img.width;
	  cvs.height = img.height;
	  q = 0.8;
   }
   if (img.width < 600 || img.height < 600) {
	  q = 0.9;
   }
   ***/

   if (img.width < 1920 || img.height < 1920) q = 0.8;
   if (img.width <  600 || img.height <  600) q = 0.9;

   if (typeof max_size == 'undefined') max_size = 1280; // tamanho maximo em pixels
   var w = img.width;
   var h = img.height;

   if (w > h) {  if (w > max_size) { h*=max_size/w; w=max_size; }
   } else     {  if (h > max_size) { w*=max_size/h; h=max_size; } }

   cvs.width = w;
   cvs.height = h;

   // cria a imagem comprimida no canvas (este passo é necessário mesmo que a variável ctx não seja usada)
   var ctx = cvs.getContext("2d").drawImage(img, 0, 0, cvs.width, cvs.height);

   // converte a imagem do canvas para base64
   var newImageData = cvs.toDataURL(mime_type, q);
   return newImageData;
}

function dataURItoBlob(dataURI) {
   // converte base64 para raw binary contido em uma string
   var byteString = atob(dataURI.split(',')[1]);
   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
   // escreve os bytes da string em um arraybuffer
   var ab = new ArrayBuffer(byteString.length);
   var ia = new Uint8Array(ab);
   // coloca os bytes do buffer nos valores corretos
   for (var i = 0; i < byteString.length; i++) {
       ia[i] = byteString.charCodeAt(i);
   }
   // escreve o arraybuffer no blob
   var blob = new Blob([ab], {type: mimeString});
   return blob;
}

function geraArquivoReduzido(idFile, idPrevia){
   var file = document.getElementById(idFile);
   if (!file) {
      alert("Não foi encontrado campo <input file> com id " + idFile);
      return;
   }

   if (file.value == '') {
      return '';
   }

   // nao eh imagem, nao vai reduzir
   if (!ehImagem(file)) {
      return file;
   }

   // eh imagem, vai reduzir
   var prev = document.getElementById(idPrevia);
   if (!prev) {
	  alert("Não foi encontrada previa <img> com id " + idPrevia);
      return;
   }
   
   var dataURL = comprimirArquivo(prev);
   var blob = dataURItoBlob(dataURL); 
   
   var blob2 = new Blob([blob], { type: "image/jpeg" });
   blob2.lastModifiedDate = new Date();

   return blob2;
}

function getNomeArquivo(idFile, idPrevia) {
    var file = document.getElementById(idFile);
    if (!file) {
       alert("Não foi encontrado campo <input file> com id " + idFile);
       return;
    }

    if (file.value == '') {
       return '';
    }
    
	var nomeArq;
    var fullPath = file.value;
    if (fullPath) {
       var startIndex = fullPath.indexOf('\\\\') >= 0 ? fullPath.lastIndexOf('\\\\') : fullPath.lastIndexOf('/');
	   var filename = fullPath.substring(startIndex);
	   if (filename.indexOf('\\\\') === 0 || filename.indexOf('/') === 0) {
	       filename = filename.substring(1);
	   }
       nomeArq = filename;
    } else {
	   nomeArq = 'imagem.jpg';
    }
    nomeArq = nomeArq.replace(/.*[\/\\]/, '');
    return nomeArq;
}

function alterouAnexo(obj,idObjPrevia,extValidas){
   // mario - 26/09/2019 - ssi 193767

   var msg = '';

   //if ((obj.files.length  > 0) && (obj.files[0].size > (524288))) msg += 'Arquivo excede o tamanho máximo de 512KB\n';

   if (typeof extValidas == 'undefined') extValidas = new Array(".JPG",".PNG",".PDF",".DOC",".TXT",".GIF",".JPEG");
   var extArquivo = obj.value;
   extArquivo = extArquivo.substring(extArquivo.lastIndexOf('.')).toUpperCase();
   if (extValidas.indexOf(extArquivo) < 0) msg += 'Extensão não permitida [' + extArquivo + ']\nUtilize extensoes: ' + extValidas + '\n\n(imagens.js)';

   if (msg != '') {
      alert(msg);
      clearInputFile(obj);
      setSrc(idObjPrevia,'');
      return;
   }

   previa(obj, idObjPrevia);
}

function getIcone(ext){
   // mario - 26/09/2019 - ssi 193767

   ext = ext.toLowerCase();
   if (ext == 'pdf') return 'pdf_anexo.png';
   if (ext == 'xls') return 'excel365.png';
   if (ext == 'doc') return 'word365.png';
   if (ext == 'txt') return 'txt.png';
   return '';
}

function previa(obj,idObjPrevia){
   // mario - 26/09/2019 - ssi 193767

   var file = obj.files[0];
   var ext = obj.value.split('.');
   ext = ext[ext.length - 1]; // extensao arq

   var icone = getIcone(ext);
   if (icone != '') {
      setSrc(idObjPrevia, '/cocamar/imagens/' + icone);
   }
   else {
      var fl = new FileReader();
      fl.onloadend = function (){
         setSrc(idObjPrevia, fl.result);
      }
   
      if (file) fl.readAsDataURL(file);
   }
}

function abrirPrevia(){
   // mario - 26/09/2019 - ssi 193767

   alert('Atenção! Falta implementar abrirPrevia() (imagens.js)');
}

function setSrc (id, s){
   // mario - 26/09/2019 - ssi 193767

   var e = document.getElementById(id);
   if (e) e.src = s;
}

function ehImagem (inputFile){
   return (inputFile.files[0].name.match(/.(jpg|jpeg|png|gif)$/i));
   //return inputFile && inputFile['type'].split('/')[0] === 'image';
}
//========================================================================================================
//========================================================================================================
// COMO USAR?

/***

<!-- ======================================================================================================== -->
<!-- 1. INCLUDES -->
<script language="javascript" src="/cocamar/jsbiblio/imagens.js"></script>
<style type="text/css">
td img {max-width:98%;max-height:120px}
#divPrevia {margin-left:122px;width:250px;height:150px;text-align:center;background:#eee;border:1px solid #aaa;padding:4px}
#divPrevia:hover {background:#ccc;border:1px solid #777;cursor:pointer}
#divPrevia img {max-width:100%;max-height:150px}
#divPrevia a {display:block;width:100%}
</style>

// ========================================================================================================
// 2. ALTEROU IMAGEM 
function event_change(obj){
   switch (obj.id) {
   case 'foto':
      alterouAnexo(document.form.foto,'foto_img');
      break;
   ...

// ========================================================================================================
// 3. SALVAR A IMAGEM
...
conteudo[04] = geraArquivoReduzido("foto", "foto_img"); // imagens.js - idFile, idPrevia
conteudo[09] = getNomeArquivo("foto", "foto_img"); // imagens.js - idFile, idPrevia
ssBuscaAjax(prog, solicitante, basebusca,conteudo,[''],false,false,[''],false,'');
...

// ========================================================================================================
// 4. RETORNO AO SALVAR
function returnBuscaOK (solicitante,retorno,erro){
   if (erro) return;

   var idx = 0;
   if (solicitante.split('_').length == 2) idx = solicitante.split('_')[1];

   if (solicitante.substr(0,7) == 'salvar_') {
      alert(retorno[1]);
      LEU[idx] = false;
      atualizar(idx);
      RMDDiv.closeDiv();
      return;
   }

   switch (solicitante) {
   case 'btSalvarEvento':
      break;
   }
}

// ========================================================================================================
// 5. CLICAR NA PREVIA
function event_click(obj){
   switch (obj.id) {
   case 'zoomPrevia':
      abrirPrevia();
      break;
   ...

function abrirPrevia(){
   if ((document.form.foto_seq.value == '') || (document.form.foto_seq.value == '0')) {
      alert('Foto ainda nao salva');
      return;
   }
   var url = 'wadm06002.r?codkaizen=' + document.form.codkaizen.value +
                        '&seqfoto=' + document.form.foto_seq.value;
   abrir(url,600,780);
}

// ========================================================================================================
// 6. INICIAR EVENTOS
   ...
   click_init_substr('btIncluir_,btAtualizar_,btSalvar_,btFechar_,btExcluir_');
   change_init('foto');
   click_init('zoomPrevia');
   ...

<!-- ======================================================================================================== -->
<!-- 7. FORMULARIO DE IMAGEM E PREVIA -->
<div id='divIdx_3'>
   <input type='hidden' name='foto_acao' id='foto_acao'>
   <input type='hidden' name='foto_seq'  id='foto_seq'>
   
   <h2>Dados da Foto</h2>
   <p>&nbsp;</p>

   <p><label>Imagem:</label> <input size='80' type='file' id='foto' name='foto'></p>
   <p><label>Prévia:</label> <div id='divPrevia' title='Clique para abrir imagem'> <a href='#.' id='zoomPrevia'> <img id="foto_img" /> </a> </div></p>
   <p>&nbsp;</p>

   <p><label>Descrição:</label> <textarea name='obs' id='obs' rows=10 cols=100></textarea></p>
   <p>&nbsp;</p>

   <p class='c'><input type='button' name='btSalvar_3' id='btSalvar_3' value=' Salvar Foto ' class='btBlack'> &nbsp; &nbsp; &nbsp; 
                <input type='button' name='btFechar_3' id='btFechar_3' value=' Fechar '></p>
   <p>&nbsp;</p>
</div> <!-- divIdx_3 -->

***/

