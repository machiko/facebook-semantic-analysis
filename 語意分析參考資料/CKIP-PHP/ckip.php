<?php
/**
 * Date: 2008/06/06
 * Shen(http://blog.ring.idv.tw)
 */
require_once "HttpClient.php";
class CKIP
{
    private $param = "";
    private $body = "";

    function __construct(){}
    public function setParam($param)
    {
        $this->param = $param;
    }
    public function doQuery()
    {
        if($this->param != "")
        {
            $uri = "http://mt.iis.sinica.edu.tw/cgi-bin/text.cgi";
            $data = array('query' => $this->param);
            $body = HttpClient::quickPost($uri, $data);

            $regex = '/URL=\'(.*)\'\">/Us';
            preg_match($regex,$body,$match);
            $redirect = "http://mt.iis.sinica.edu.tw/" . $match[1];
            $body = HttpClient::quickGet($redirect);

            $regex = '/HREF=(.*)>/Us';
            preg_match($regex,$body,$match);
            $filename = str_replace(".txt", ".tag.txt", $match[1]);
            $redirect = "http://mt.iis.sinica.edu.tw/uwextract/pool/" . $filename;
            $this->body = HttpClient::quickGet($redirect);

            return true;
        }
        return false;
    }
    public function getBody()
    {
        return $this->body;
    }
}
?>