<?php
require_once "CKIP.php";
$ckip = new CKIP();
$ckip->setParam("這個東西不錯吃!");
$ckip->doQuery();
$body = $ckip->getBody();
$body = iconv("Big5","UTF-8",$body);
echo $body;
?>