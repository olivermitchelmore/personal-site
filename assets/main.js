function add_thought() {
    console.log("button pressed");
    let thought_text = document.getElementById("user_thought");
    
    let thought = document.createElement('div');
    thought.textContent = thought_text.value;

    let board = document.getElementById("thought_board");
    board.appendChild(thought);
    handle_thought_placement(thought);
    console.log(thought_text.value);
    // begin drag
}

function handle_thought_placement(thought) {
    thought.addEventListener
}
