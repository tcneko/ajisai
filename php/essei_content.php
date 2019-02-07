<?php
$db_path = 'sqlite:../../data/jp.db';
$essei_base_dir = '../../data/essei/';
$quary_sql = 'SELECT md_path FROM essei ORDER BY random() limit 1';

try {
    $dbh = new PDO($db_path);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sth = $dbh->prepare($quary_sql);
    $sth->execute();
    $out = $sth->fetchAll(PDO::FETCH_ASSOC);
    $dbh = null;
    readfile($essei_base_dir.$out[0]['md_path']);
} catch (PDOException $e) {
    echo "";
}
