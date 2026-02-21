const board = document.getElementById("thought_board");
const board_rect = board.getBoundingClientRect();
let new_thought_id = "new_thought";
let dragging = false;
let offset_x = 0;
let offset_y = 0;
let thought_rect = null;
let thought_width = null;

function add_active_thought() {
    let old_thought = document.getElementById(new_thought_id);
    if (old_thought) old_thought.remove();
    
    let thought_text = document.getElementById("user_thought");
    let thought = document.createElement('div');
    thought.textContent = thought_text.value;

    thought.addEventListener("pointerdown", start_drag)
    board.addEventListener("pointerup", end_drag)
    thought.id = new_thought_id;
    thought.style.border = "0.5px solid blue";
    thought.style.zIndex = 10000;

    board.appendChild(thought);
}

function add_thought(thought) {
    let new_thought = document.createElement('div');

    new_thought.textContent = thought.thought;
    new_thought.style.left = `${thought.x}px`;
    new_thought.style.top = `${thought.y}px`;
    new_thought.style.zIndex = thought.z;
    
    board.appendChild(new_thought);
}

function start_drag(event) {
    let thought = document.getElementById("new_thought");
    thought_rect = thought.getBoundingClientRect();
    dragging = true;

    offset_x = event.clientX - thought_rect.left;
    offset_y = event.clientY - thought_rect.top;
}

function on_pointer_move(event) {
    if (!dragging) return;

    let thought = document.getElementById(new_thought_id);

    let x = event.clientX - offset_x;
    let y = event.clientY - offset_y;

    const final_x = Math.max(board_rect.left, Math.min(x, board_rect.right - thought_rect.width));
    const final_y = Math.max(board_rect.top, Math.min(y, board_rect.bottom - thought_rect.height));

    thought.style.top = `${final_y}px`;
    thought.style.left = `${final_x}px`;
}

function end_drag(event) {
    dragging = false;
}

async function submit_thought() {
    let new_thought = document.getElementById(new_thought_id);
    let thought_text = new_thought.textContent;

    let x_left = parseFloat(new_thought.style.left);
    let board_width = (board_rect.width - thought_rect.width);
    let x = Math.round(((x_left - board_rect.left) / board_width) * 1000);

    let y_top = parseFloat(new_thought.style.top);
    let y = Math.round(((y_top - board_rect.top) / board_width) * 1000);

    new_thought.style.border = "0.5px solid orange"

    const response = await fetch("https://api.olliemitchelmore.com/thought-submission", {
        method: "POST",
        body: JSON.stringify({
            thought: thought_text,
            x: x,
            y: y
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    new_thought.remove();

    if (response.ok) {
        add_thought({ thought: thought_text, x: x_left, y: y_top, z: 999999 });
    }
    else {
        console.error("Error submitting thought: ", response.status);
    }
}

function get_thought_rect_size() {
    let probe = document.createElement('div');
    probe.style.border = "solid 0.5px black";
    board.append(probe);
    let rect = probe.getBoundingClientRect();
    probe.remove();
    thought_width = rect.width;
}

function display_thoughts(thought_list) {
    if (!thought_width) get_thought_rect_size();

    let board_width = (board_rect.width - thought_width);
    
    for (let thought of thought_list) {
        thought.x = (board_width * (thought.x / 1000)) + board_rect.left;
        thought.y = (board_width * (thought.y / 1000)) + board_rect.top;
        add_thought(thought)
    }
}

async function get_thoughts() {
    try {
        const api_response = fetch("https://api.olliemitchelmore.com/thoughts").then(res => res.json());

        get_thought_rect_size();

        const thoughts = await api_response;
        display_thoughts(thoughts);
    } catch (error) {
        console.log(error);
    }
}

get_thoughts();