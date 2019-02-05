// Cookie

function set_cookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";expires=" + d.toGMTString() + ";path=" + window.location.pathname;
}

function get_cookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


// Menu funcion

function reset_menu() {
    choice_menu = document.getElementsByName("choice_menu");
    if (window.innerWidth > 992) {
        for (var ix = 0; ix < choice_menu.length; ++ix) {
            choice_menu[ix].style.cssText = "position:absolute;z-index:5;min-width:24%;";
        }
    } else {
        for (var ix = 0; ix < choice_menu.length; ++ix) {
            choice_menu[ix].style.cssText = "";
        }
    }
}

function switch_accordion(id) {
    var accordionMenu = document.getElementById(id);
    var accordionMenuArray = document.getElementsByName('choice_menu');
    for (var ix = 0; ix < accordionMenuArray.length; ++ix) {
        if (!accordionMenuArray[ix].classList.contains('w3-hide') && accordionMenuArray[ix].id != id) {
            accordionMenuArray[ix].classList.add('w3-hide')
        }
    }
    if (accordionMenu.classList.contains("w3-hide")) {
        accordionMenu.classList.remove("w3-hide");
    } else {
        accordionMenu.classList.add("w3-hide");
    }
}

function update_time_use() {
    ++time_use;
    document.getElementById("timer_span").innerHTML = "<i class='fa fa-clock-o' aria-hidden='true'></i> 耗时: " +
        Math.floor(time_use / 60) + " 分 " + time_use % 60 + " 秒";
}


// Choice

function show_choice_tips(tip_id, tip_str) {
    document.getElementById(tip_id).innerHTML = tip_str;
}

function show_start_button_tips() {
    document.getElementById("start_button_tips").innerHTML =
        "<lable class='w3-animate-right'><i class='fa fa-exclamation-triangle w3-text-red' aria-hidden='true'></i> 请先选择题型</lable>";
}

function show_sub_choice() {
    var flag;
    var choice_div = document.getElementsByName("sub_choice_div");
    for (ix = 0; ix < choice_div.length; ++ix) {
        flag = 0;
        for (iy = 0; iy < arguments.length; ++iy) {
            if (choice_div[ix].id == arguments[iy]) {
                choice_div[ix].classList.remove("w3-hide");
                flag = 1;
                break;
            }
        }
        if (flag == 0) {
            choice_div[ix].classList.add("w3-hide");
        }
    }
}

function make_choice(obj, ch_name, no, choice, is_cookie) {
    real_choice[no] = choice;
    if (is_cookie) {
        show_choice_tips(ch_name + "_tips", obj);
    } else {
        calc_real_choice();
        show_choice_tips(ch_name + "_tips", obj.innerHTML);
        switch_accordion(ch_name + "_menu");
        set_cookie(ch_name, obj.innerHTML + "," + choice, 7);
    }
}

// Load data

function ajax_get_content(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            response_data = JSON.parse(this.responseText);
            load_data_end();
        }
    };
    xhttp.open("GET", page + "?c=" + real_choice[0], true);
    xhttp.send();
    load_data_start();
}


function load_data_start() {
    document.getElementById("start_button").disabled = 'disabled';
    document.getElementById("start_button").innerHTML = '<i class="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i> <b>加载数据</b>'
}

function load_data_end() {
    document.getElementById("start_button").disabled = '';
    document.getElementById("start_button").innerHTML = '<i class="fa fa-circle-o-notch" aria-hidden="true"></i> <b>现在开始</b>'
}

// Input Box

function enable_input_button() {
    document.getElementById("clean_input").addEventListener("click", clean_input);
    document.getElementById("show_answer").addEventListener("click", show_answer);
    document.getElementById("next_quiz").addEventListener("click", next_quiz);
}

function disable_input_button() {
    document.getElementById("clean_input").removeEventListener("click", clean_input);
    document.getElementById("show_answer").removeEventListener("click", show_answer);
    document.getElementById("next_quiz").removeEventListener("click", next_quiz);
}

function clean_input() {
    document.getElementById("qa_input").value = "";
    document.getElementById("qa_answer").innerHTML = "...";
}

function red_input() {
    document.getElementById("qa_answer").classList.add("w3-border-red");
    document.getElementById("qa_answer").classList.remove("w3-border-green");
}

function green_input() {
    document.getElementById("qa_answer").classList.remove("w3-border-red");
    document.getElementById("qa_answer").classList.add("w3-border-green");
}

function init_input() {
    red_input();
    var inputBox = document.getElementById("qa_input");
    inputBox.addEventListener("input", sync_answer);
    inputBox.removeEventListener("keypress", next_quiz);
}

function finish_input() {
    green_input();
    var inputBox = document.getElementById("qa_input");
    inputBox.removeEventListener("input", sync_answer);
    inputBox.addEventListener("keypress", next_quiz);
}

function update_socre() {
    if (is_right) {
        ++answer_count[0];
    }
    ++answer_count[1];
}

function update_correct_rate() {
    if (answer_count[1] > 0) {
        var correct_rate = Math.ceil(answer_count[0] / answer_count[1] * 100);
        document.getElementById("resault_span").innerHTML = "<i class='fa fa-check-square-o' aria-hidden='true'></i> 正确率: " +
            correct_rate + "%";
    }
}

function sync_answer() {
    var inputValue = document.getElementById("qa_input").value;
    if (inputValue == "") {
        document.getElementById("qa_answer").innerHTML = "...";
    } else {
        document.getElementById("qa_answer").innerHTML = inputValue;
    }
    check_answer();
}

function show_answer() {
    document.getElementById("qa_answer").innerHTML = answer_data[quiz_index];
    finish_input();
}