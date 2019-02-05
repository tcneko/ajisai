var data_array = {
    6: ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を"],
    7: ["が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
    8: ["きゃ", "きゅ", "きょ", "しゃ", "しゅ", "しょ", "ちゃ", "ちゅ", "ちょ", "にゃ", "にゅ", "にょ", "ひゃ", "ひゅ", "ひょ", "みゃ", "みゅ", "みょ", "りゃ", "りゅ", "りょ", "ぎゃ", "ぎゅ", "ぎょ", "じゃ", "じゅ", "じょ", "びゃ", "びゅ", "びょ", "ぴゃ", "ぴゅ", "ぴょ"],
    3: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ", "マ", "ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ヲ"],
    4: ["ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ", "ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ", "パ", "ピ", "プ", "ペ", "ポ"],
    5: ["キャ", "キュ", "キョ", "シャ", "シュ", "ショ", "チャ", "チュ", "チョ", "ニャ", "ニュ", "ニョ", "ヒャ", "ヒュ", "ヒョ", "ミャ", "ミュ", "ミョ", "リャ", "リュ", "リョ", "ギャ", "ギュ", "ギョ", "ジャ", "ジュ", "ジョ", "ビャ", "ビュ", "ビョ", "ピャ", "ピュ", "ピョ"],
    0: ["a", "i", "u", "e", "o", "ka", "ki", "ku", "ke", "ko", "sa", "shi", "su", "se", "so", "ta", "chi", "tsu", "te", "to", "na", "ni", "nu", "ne", "no", "ha", "hi", "fu", "he", "ho", "ma", "mi", "mu", "me", "mo", "ya", "yu", "yo", "ra", "ri", "ru", "re", "ro", "wa", "o"],
    1: ["ga", "gi", "gu", "ge", "go", "za", "ji", "zu", " ze", "zo", "da", "ji", "zu", "de", "do", "ba", "bi", "bu", "be", "bo", "pa", "pi", "pu", "pe", "po"],
    2: ["kya", "kyu", "kyo", "sha", "shu", "sho", "cha", "chu", "cho", "nya", "nyu", "nyo", "hya", "hyu", "hyo", "mya", "myu", "myo", "rya", "ryu", "ryo", "gya", "gyu", "gyo", "ja", "ju", "jo", "bya", "byu", "byo", "pya", "pyu", "pyo"]
};

var quiz_array = [];
var answer_array = [];
var ix;
var real_choice = [-1, -1, 0, 0];
var create_timer;
var time_use = 0;
var show_answer_count = 0;

function main_choice(obj, sc, is_cookie) {
    show_sub_choice("range_choice_div", "order_choice_div");
    make_choice(obj, "main_choice", 1, sc, is_cookie);
}

function range_choice(obj, sc, is_cookie) {
    make_choice(obj, "range_choice", 2, sc, is_cookie);
}

function order_choice(obj, sc, is_cookie) {
    make_choice(obj, "order_choice", 3, sc, is_cookie);
}

function init_choice_by_cookie() {
    var cookie_str = get_cookie("main_choice");
    var cookie_array = [];
    if (cookie_str != "") {
        cookie_array = cookie_str.split(",");
        main_choice(cookie_array[0], parseInt(cookie_array[1]), true);
    }
    cookie_str = get_cookie("range_choice")
    if (cookie_str != "") {
        cookie_array = cookie_str.split(",");
        range_choice(cookie_array[0], parseInt(cookie_array[1]), true);
    }
    cookie_str = get_cookie("order_choice")
    if (cookie_str != "") {
        cookie_array = cookie_str.split(",");
        order_choice(cookie_array[0], parseInt(cookie_array[1]), true);
    }
    calc_real_choice();
}

function calc_real_choice() {
    if (real_choice[1] == -1) {
        real_choice[0] = -1;
        return;
    }
    var range_choice = 7;
    if (real_choice[2] != 4) {
        range_choice = 0 | 1 << real_choice[2];
    }
    real_choice[0] = 0 | range_choice << (parseInt(real_choice[1] / 10) * 3 + 9) |
        range_choice << (parseInt(real_choice[1] % 10) * 3);
    reset_start();
    make_output();
}

function reset_start() {
    if (document.getElementById("start_button").classList.contains("w3-hide")) {
        stop_now();
    }
}

function start_now() {
    document.getElementById("timer_span").innerHTML = "";
    document.getElementById("resault_span").innerHTML = "";
    if (real_choice[0] == -1) {
        show_start_button_tips();
        return;
    }
    show_output();
    time_use = 0;
    show_answer_count = 0;
    create_timer = setInterval(update_time_use, 1000);
    document.getElementById("start_button_tips").innerHTML = "";
    document.getElementById("start_button").classList.add("w3-hide");
    document.getElementById("stop_button").classList.remove("w3-hide");
}

function stop_now() {
    clearInterval(create_timer);
    var quiz_group = document.getElementsByClassName("quiz_group");
    var real_index;
    for (ix = 0; ix < quiz_array.length; ++ix) {
        if (quiz_group[ix].name == "init") {
            real_index = quiz_array.indexOf(quiz_group[ix].innerHTML);
            quiz_group[ix].name = real_index;
            quiz_group[ix].innerHTML = answer_array[real_index];
            quiz_group[ix].classList.add("ba-kana-click");
        }
    }
    document.getElementById("stop_button").classList.add("w3-hide");
    document.getElementById("start_button").classList.remove("w3-hide");
}

function make_output() {
    quiz_array = [];
    answer_array = [];
    if (real_choice[0] == -1) {
        return;
    }
    var tmp_real_choice = real_choice[0];
    for (ix = 0; ix < 9; ++ix) {
        if (tmp_real_choice % 2 == 1) {
            answer_array = answer_array.concat(data_array[ix]);
        }
        tmp_real_choice >>= 1;
    }
    for (ix = 0; ix < 9; ++ix) {
        if (tmp_real_choice % 2 == 1) {
            quiz_array = quiz_array.concat(data_array[ix]);
        }
        tmp_real_choice >>= 1;
    }
}

function show_output() {
    var array_tmp = quiz_array.slice(0);
    if (real_choice[3] == 0) {
        array_tmp.sort(function (a, b) {
            return 0.5 - Math.random();
        });
    }
    var tmp_str = "";
    for (var ix = 0; ix < array_tmp.length; ++ix) {
        tmp_str += "<span class='w3-center w3-col s4 m3 l2' style='margin-top:48px'>\
        <button class='w3-button w3-hover-red w3-padding w3-xlarge ba-kana quiz_group' name='init' onclick='switch_answer(this)'>" +
            array_tmp[ix] + "</button></span>";
    }
    document.getElementById("main_div").innerHTML = tmp_str;
}

function switch_answer(obj) {
    var real_index;
    if (obj.name != "init") {
        obj.innerHTML = quiz_array[obj.name]
        obj.name = "init";
        obj.classList.remove("ba-kana-click");
        obj.classList.remove("w3-card");
    } else {
        real_index = quiz_array.indexOf(obj.innerHTML);
        obj.name = real_index;
        obj.innerHTML = answer_array[real_index];
        obj.classList.add("ba-kana-click");
        obj.classList.add("w3-card");
        ++show_answer_count;
        document.getElementById("resault_span").innerHTML = "<i class='fa fa-search' aria-hidden='true'></i> 显示答案: " + show_answer_count + " 次";

    }
}