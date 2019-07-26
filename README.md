# jpegizador
Um programa extremamente simples que converte imagens bonitas em imagens feias utilizando o navegador

/********************************************** Descrição **********************************************/
/*******************************************************************************************************/
/***                                                                                                 ***/
/***    Para a aplicação final, poderá ser colocado o <input> da imagem fora do <form>, e, através   ***/
/***    de JavaScript, fazer com que um <input> tipo "hidden" dentro do <form> receba a imagem       ***/
/***    gerada pelo programa, já comprimida (ver exemplo). Valores de 50 a 70 reduzem significa-     ***/
/***    tivamente o tamanho do arquivo, sem grande perda de dados. Imagens com extensão PNG podem    ***/
/***    ter uma diminuição de tamanho de até 95%. Uma imagem do tipo JPEG de 5MB (aproximadamente    ***/
/***    o peso de fotos tiradas com celulares de última geração) com qualidade 70% sofre redução     ***/
/***    para aproximadamente 900KB (diminuição de 82% do tamanho do arquivo).                        ***/
/***                                                                                                 ***/
/*******************************************************************************************************/
/*********************************************** Exemplo ***********************************************/
/***                                                                                                 ***/
/***    <img src="codigoGerado...data64..." id="result_compress_image" /> (ver HTML DOM)             ***/
/***    <form>                                                                                       ***/
/***	   <input type="hidden" name="imagemHidden" id="imagemHidden" />                               ***/
/***	   <input type="submit" value="send" onclick="copiar()" />                                     ***/
/***		                                                                                             ***/
/***	   <script type="text/javascript">                                                             ***/
/***		 function copiar()                                                                           ***/
/***		 {                                                                                           ***/
/***		    var imgSrc = document.getElementById("result_compress_image");                           ***/
/***		    var hidden = document.getElementById("imagemHidden");                                    ***/
/***		    hidden.value = imgSrc.getAttribute("src");                                               ***/
/***		    alert(hrc.value);                                                                        ***/
/***		 }                                                                                           ***/
/***    /script>                                                                                     ***/
/***    </form>                                                                                      ***/
/***                                                                                                 ***/
/*******************************************************************************************************/
/******************************************* Planos futuros ********************************************/
/***                                                                                                 ***/
/***    -> Features de "drag and drop" com múltiplas imagens;                                        ***/
/***    -> Features de fazer upload através de link e através do clipboard (ctrl + C);               ***/
/***    -> Melhor esclarecimento do tamanho da imagem e qual foi a porcentagem de compressão;        ***/
/***                                                                                                 ***/
/*******************************************************************************************************/
/*******************************************************************************************************/
