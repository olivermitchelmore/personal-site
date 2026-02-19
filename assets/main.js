const board = document.getElementById("thought_board");
const board_rect = board.getBoundingClientRect();
let new_thought_id = "new_thought";
let dragging = false;
let offset_x = 0;
let offset_y = 0;
let thought_rect = null;

function add_thought() {
    let thought_text = document.getElementById("user_thought");
    let thought = document.createElement('div');
    thought.textContent = thought_text.value;
    thought.classList.add("thought");

    thought.addEventListener("pointerdown", start_drag)
    board.addEventListener("pointerup", end_drag)
    thought.id = new_thought_id;

    board.appendChild(thought);
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
    console.log("not dragging");
}

function submit_thought() {
    let new_thought = document.getElementById(new_thought_id);
    let thought_text = new_thought.textContent;

    let x_left = parseFloat(new_thought.style.left);
    let board_width = (board_rect.width - thought_rect.width);
    let x_calc = Math.round(((x_left - board_rect.left) / board_width) * 100);

    let y_top = parseFloat(new_thought.style.top);
    let y_calc = Math.round(((y_top - board_rect.top) / board_width) * 100);

    let coordinates = { thought: thought_text, x: x_calc, y: y_calc };
    let thought_coordinates = [coordinates];

    display_thoughts(thought_coordinates);
}

function display_thoughts(thought_list) {
    let board_width = (board_rect.width - thought_rect.width);
    
    for (let thought of thought_list) {
        console.log(thought);
        let x = board_width * (thought.x / 100);
        let y = board_width * (thought.y / 100);
        console.log("x: ", x, "y: ", y);
    }
}