<?php
$dir = 'sqlite:../sql/jp.db';
$quarySql = '';
$quarySqlWhere = '';

$choice = $_GET["c"];

function make_where($cond)
{
    global $quarySqlWhere;
    if ($quarySqlWhere == "") {
        $quarySqlWhere .= (" WHERE ".$cond);
    } else {
        $quarySqlWhere .= (" AND ".$cond);
    }
}

function get_sub_choice_lv()
{
    global $choice_lv;
    switch ($choice_lv) {
        case 1:
            break;
        case 2:
            make_where("feq > 100 AND feq < 200");
            break;
        case 4:
            make_where("feq > 200 AND feq < 300");
            break;
        case 8:
            make_where("feq > 300 AND feq < 400");
            break;
        case 16:
            make_where("feq > 400 AND feq < 500");
            break;
        case 32:
            make_where("feq > 500 AND feq < 600");
            break;
        case 64:
            make_where("feq > 600 AND feq < 700");
            break;
        default:
            die("[]");
    }
}

function get_sub_choice_hinshi()
{
    global $choice_hinsi;
    switch ($choice_hinsi) {
        case 1:
            break;
        case 2:
            make_where("hinshi LIKE '%名%'");
            break;
        case 4:
            make_where("hinshi LIKE '%五%' OR hinshi LIKE '%一% OR hinshi LIKE %サ%'");
            break;
        case 8:
            make_where("hinshi LIKE '%,形%' OR hinshi LIKE '%形,%' OR hinshi = '形'");
            break;
        case 16:
            make_where("hinshi LIKE '%形动%'");
            break;
        case 32:
            make_where("hinshi LIKE '%副%'");
            break;
        case 64:
            make_where("hinshi LIKE '%组%' OR hinshi LIKE '%叹%' OR hinshi LIKE '%接%' OR hinshi LIKE '%连%' OR hinshi LIKE '%专%'");
            break;
        default:
            die("[]");
    }
}

if (!filter_var($choice, FILTER_VALIDATE_INT)) {
    die("[]");
}

$choice_main = $choice & 255;
$choice_lv = $choice >> 8 & 255;
$choice_hinsi = $choice >> 16 & 255;

switch ($choice_main) {
    case 1:
    case 2:
        get_sub_choice_hinshi();
        get_sub_choice_lv();
        $quarySql = "SELECT tango,kana,chs,hinshi FROM tango".$quarySqlWhere." ORDER BY random() limit 20";
        break;
    case 4:
    case 8:
        get_sub_choice_lv();
        make_where("tango != kana");
        $quarySql = "SELECT tango,kana,hinshi FROM tango".$quarySqlWhere." ORDER BY random() limit 20";
        break;
    case 16:
        get_sub_choice_lv();
        $quarySql = "SELECT tango,hinshi FROM tango".$quarySqlWhere." ORDER BY random() limit 20";
        break;
    case 32:
        get_sub_choice_lv();
        make_where("ton IS NOT NULL");
        $quarySql = "SELECT tango,ton,hinshi FROM tango".$quarySqlWhere." ORDER BY random() limit 20";
        break;
    default:
        die("[]");
}
    

try {
    $dbh = new PDO($dir);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sth = $dbh->prepare($quarySql);
    echo $$quarySql;
    $sth->execute();
    $out = $sth->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($out);
    $dbh = null;
} catch (PDOException $e) {
    echo "[]";
}
