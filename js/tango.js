var quiz_table_head = "<table class='w3-table w3-bordered w3-hoverable w3-small w3-animate-bottom' id='qa_table'><tr class='w3-light-grey'><th>Quiz</th><th>Answer</th><th>T/F</th></tr>";

var ix, iy, iz;
var real_choice = [-1, -1, 0, 0, 0]; // 0:php request, 1:main, 2:lv, 3:hinshi, 4:mode
var quiz_index = -1;
var response_data = [];
var quiz_data = [];
var answer_data = [];
var answer_data_group = [];
var is_right = false;
var answer_count = [0, 0];
var create_timer;
var time_use = 0;

function main_choice(obj, choice, is_cookie) {
    switch (choice) {
        case 0:
            show_sub_choice("lv_choice_div", "hinshi_choice_div", "mode_choice_div");
            break;
        case 1:
            show_sub_choice("lv_choice_div", "hinshi_choice_div", "mode_choice_div");
            break;
        case 2:
            show_sub_choice("lv_choice_div", "mode_choice_div");
            break;
        case 3:
            show_sub_choice("lv_choice_div", "mode_choice_div");
            break;
        case 4:
            show_sub_choice("lv_choice_div", "mode_choice_div");
            break;
        case 5:
            show_sub_choice("lv_choice_div", "mode_choice_div");
            break;
        case 6:
            show_sub_choice("lv_choice_div", "mode_choice_div");
            break;
    }
    make_choice(obj, "main_choice", 1, choice, is_cookie);
}

function lv_choice(obj, choice, is_cookie) {
    make_choice(obj, "lv_choice", 2, choice, is_cookie);
}

function hinshi_choice(obj, choice, is_cookie) {
    make_choice(obj, "hinshi_choice", 3, choice, is_cookie);
}

function mode_choice(obj, choice, is_cookie) {
    make_choice(obj, "mode_choice", 4, choice, is_cookie);
}

function init_choice_by_cookie() {
    var cookie_str = get_cookie("main_choice");
    var cookie_array = [];
    if (cookie_str != "") {
        cookie_array = cookie_str.split(",");
        main_choice(cookie_array[0], parseInt(cookie_array[1]), true);
    }
    cookie_str = get_cookie("lv_choice")
    if (cookie_str != "") {
        cookie_array = cookie_str.split(",");
        lv_choice(cookie_array[0], parseInt(cookie_array[1]), true);
    }
    cookie_str = get_cookie("hinshi_choice")
    if (cookie_str != "") {
        cookie_array = cookie_str.split(",");
        hinshi_choice(cookie_array[0], parseInt(cookie_array[1]), true);
    }
    cookie_str = get_cookie("mode_choice")
    if (cookie_str != "") {
        cookie_array = cookie_str.split(",");
        mode_choice(cookie_array[0], parseInt(cookie_array[1]), true);
    }
    calc_real_choice();
}

function calc_real_choice_core() {
    if (real_choice[1] == -1) {
        real_choice[0] = -1;
        return;
    }
    real_choice[0] = 0 | 1 << real_choice[1];
    var choice_div = document.getElementsByName("sub_choice_div");
    for (ix = 0; ix < choice_div.length; ++ix) {
        if (choice_div[ix].classList.contains("w3-hide")) {
            continue;
        }
        real_choice[0] = real_choice[0] | 1 << ((ix + 1) * 8 + real_choice[ix + 2]);
    }
}

function calc_real_choice() {
    calc_real_choice_core();
    ajax_get_content("php/tango_content.php");
    reset_start();
}

function start_now() {
    if (response_data.length == 0) {
        show_start_button_tips();
        return;
    }
    document.getElementById("timer_span").innerHTML = "";
    document.getElementById("resault_span").innerHTML = "";
    document.getElementById("start_button_tips").innerHTML = "";
    document.getElementById("start_button").classList.add("w3-hide");
    document.getElementById("stop_button").classList.remove("w3-hide");
    quiz_index = -1;
    answer_count = [0, 0];
    time_use = 0;
    create_timer = setInterval(update_time_use, 1000);
    init_quiz();
    init_table();
    next_quiz();
    enable_input_button();
    document.getElementById("qa_input").disabled = "";
    document.getElementById("qa_input").focus();
}

function stop_now() {
    disable_input_button();
    clearInterval(create_timer);
    document.getElementById("qa_quiz").innerHTML = "...";
    document.getElementById("stop_button").classList.add("w3-hide");
    document.getElementById("start_button").classList.remove("w3-hide");
    clean_input();
    red_input();
    document.getElementById("qa_input").disabled = "disabled"
    if (document.getElementById("qa_table").name == "group") {
        for (; quiz_index < quiz_data.length; ++quiz_index) {
            update_table();
        }
    }
}

function reset_start() {
    if (document.getElementById("start_button").classList.contains("w3-hide")) {
        stop_now();
    }
}

function endless() {
    quiz_index = -1;
    init_quiz();
    next_quiz();
}

function init_quiz() {
    quiz_data = [];
    answer_data = [];
    switch (real_choice[1] + 1) {
        case 1:
            for (ix = 0; ix < response_data.length; ++ix) {
                quiz_data[ix] = response_data[ix]["chs"] + " [" + response_data[ix]["hinshi"] + "]";
                if (response_data[ix]["tango"] != response_data[ix]["kana"]) {
                    answer_data[ix] = response_data[ix]["tango"] + "、" + response_data[ix]["kana"];
                } else {
                    answer_data[ix] = response_data[ix]["tango"];
                }
            }
            break;
        case 2:
            for (ix = 0; ix < response_data.length; ++ix) {
                quiz_data[ix] = response_data[ix]["tango"] + " [" + response_data[ix]["hinshi"] + "]";
                answer_data[ix] = response_data[ix]["chs"];
            }
            break;
        case 3:
            for (ix = 0; ix < response_data.length; ++ix) {
                quiz_data[ix] = response_data[ix]["tango"] + " [" + response_data[ix]["hinshi"] + "]";
                answer_data[ix] = response_data[ix]["kana"];
            }
            break;
        case 4:
            for (ix = 0; ix < response_data.length; ++ix) {
                quiz_data[ix] = response_data[ix]["kana"] + " [" + response_data[ix]["hinshi"] + "]";
                answer_data[ix] = response_data[ix]["tango"];
            }
            break;
        case 5:
            for (ix = 0; ix < response_data.length; ++ix) {
                quiz_data[ix] = response_data[ix]["tango"];
                answer_data[ix] = response_data[ix]["hinshi"];
            }
            break;
        case 6:
            for (ix = 0; ix < response_data.length; ++ix) {
                quiz_data[ix] = response_data[ix]["tango"] + " [" + response_data[ix]["hinshi"] + "]";
                answer_data[ix] = response_data[ix]["ton"];
            }
            break;
    }
    response_data = [];
    answer_pre_proc();
    ajax_get_content("php/tango_content.php");
}

function init_table() {
    if (real_choice[4] == 0) {
        var tableStr = quiz_table_head;
        for (ix = 0; ix < quiz_data.length; ++ix) {
            tableStr += "<tr><td>" + quiz_data[ix] + "</td><td id='table_ans" + ix +
                "'><i class='fa fa-question' aria-hidden='true'></i></td><td id='table_rw" + ix +
                "'><i class='fa fa-question' aria-hidden='true'></i></td></tr>";
        }
        tableStr += "</table>";
        document.getElementById("qa_tableDiv").innerHTML = tableStr;
        document.getElementById("qa_table").name = 'group';
    } else {
        document.getElementById("qa_tableDiv").innerHTML = quiz_table_head + "</table>";
        document.getElementById("qa_table").name = 'endless';
    }
}

function next_quiz() {
    clean_input();
    if (quiz_index != -1) {
        update_socre();
        update_table();
    }
    update_correct_rate();
    ++quiz_index;
    if (quiz_data[quiz_index] == undefined) {
        if (real_choice[4] == 1) {
            endless();
        } else {
            stop_now();
        }
        return;
    }
    console.log(quiz_data[quiz_index]);
    console.log(answer_data[quiz_index]);
    is_right = false;
    var quizStr;
    switch (real_choice[1] + 1) {
        case 1:
            quizStr = "<b>" + quiz_data[quiz_index] + "</b> 的日文是？";
            break;
        case 2:
            quizStr = "<b>" + quiz_data[quiz_index] + "</b> 的中文是？";
            break;
        case 3:
            quizStr = "<b>" + quiz_data[quiz_index] + "</b> 对应的假名是？";
            break;
        case 4:
            quizStr = "<b>" + quiz_data[quiz_index] + "</b> 对应的汉字是？";
            break;
        case 5:
            quizStr = "<b>" + quiz_data[quiz_index] + "</b> 的词性是？";
            break;
        case 6:
            quizStr = "<b>" + quiz_data[quiz_index] + "</b> 的声调是？";
            break;
    }
    document.getElementById("qa_quiz").innerHTML = quizStr;
    init_input();
}

function update_table() {
    if (answer_data[quiz_index] == undefined) {
        return;
    }
    var rw_mark = "";
    if (is_right) {
        rw_mark = "<i class='fa fa-check' aria-hidden='true'></i>";
    } else {
        rw_mark = "<i class='fa fa-times' aria-hidden='true'></i>";
    }
    if (real_choice[4] == 0) {
        document.getElementById("table_ans" + quiz_index).innerHTML = answer_data[quiz_index];
        document.getElementById("table_rw" + quiz_index).innerHTML = rw_mark;
    } else {
        var tmp_element_tr = document.createElement("tr");
        tmp_element_tr.classList = "w3-animate-zoom";
        tmp_element_tr.innerHTML = "<td>" + quiz_data[quiz_index] +
            "</td><td>" + answer_data[quiz_index] +
            "</td><td>" + rw_mark + "</td>";
        var quiz_table = document.getElementById("qa_table");
        if (quiz_table.childNodes.length == 1) {
            quiz_table.appendChild(tmp_element_tr);
        } else {
            quiz_table.insertBefore(tmp_element_tr, quiz_table.childNodes[1]);
        }
        if (quiz_table.childNodes.length > 10) {
            quiz_table.removeChild(quiz_table.childNodes[10]);
        }
    }
}

function answer_pre_proc() {
    var ix_array = [];
    for (ix = 0; ix < answer_data.length; ++ix) {
        ix_array = answer_data[ix].split(new RegExp("；|;"));
        answer_data_group[ix] = [];
        for (iy = 0; iy < ix_array.length; ++iy) {
            answer_data_group[ix][iy] = ix_array[iy].split(new RegExp("、|・"));
            var answer_data_group_ix_iy_length = answer_data_group[ix][iy].length;
            for (iz = 0; iz < answer_data_group_ix_iy_length; ++iz) {
                if (answer_data_group[ix][iy][iz].indexOf("（") != -1 || answer_data_group[ix][iy][iz].indexOf("(") != -1) {
                    answer_data_group[ix][iy].push(answer_data_group[ix][iy][iz].replace(/\(.*\)|（.*）/ig, ""));
                }
            }
        }
    }
}

function check_answer() {
    var answer = document.getElementById("qa_answer").innerHTML;
    var right_flag = [false];
    if (answer.indexOf("?") != -1 || answer.indexOf("？") != -1 || answer.indexOf("。") != -1) {
        show_answer();
        return;
    }
    ansewer_group = answer.split(new RegExp("；|;|，|,|、|・"))
    for (ix = 0; ix < ansewer_group.length; ++ix) {
        for (iy = 0; iy < answer_data_group[quiz_index].length; ++iy) {
            for (iz = 0; iz < answer_data_group[quiz_index][iy].length; ++iz) {
                if (ansewer_group[ix] == answer_data_group[quiz_index][iy][iz]) {
                    right_flag[iy] = true;
                }
            }
        }
    }
    for (ix = 0; ix < answer_data_group[quiz_index].length; ++ix) {
        if (right_flag[ix] != true) {
            break;
        }
    }
    if (ix == answer_data_group[quiz_index].length) {
        is_right = true;
        show_answer();
    }
}