var input = {value: "", stack: "S"};
var invertedTarget = "";
var shouldContinue = true;
var stepCount = 0;
var play = true;
var charCount = 0;

stateS = {
    0: "aAb",
    size: 1
}

stateA = {
    0: "aBc",
    1: "bCc",
    size: 2
}

stateB = {
    0: "cA",
    1: "bCa",
    size: 2
}

stateC = {
    0: "bAb",
    1: "",
    size: 2
}

states = {
    "S": stateS,
    "A": stateA,
    "B": stateB,
    "C": stateC
}

function generateInput() {
	var newInput = "";

	for (var i = 0; i < input.value.length; i++) {
		newInput = "<li id='char" + i + "'><a>" + input.value[i] + "</a></li>";
		$(".pagination").append(newInput);
	}
}

function stepbyStep() {
	if (play) {
		input.value = $("#input").val();
		generateInput();
		play = false;
	}
	execute();
}

function full() {
	if (play) {
		input.value = $("#input").val();
		generateInput();
		play = false;
	}

	execute();

	if (shouldContinue) {
		setTimeout(full, 300);
	}
}

function cleanValidation() {
	input = { value: "", stack: "S" };
	invertedTarget = "";
	shouldContinue = true;
	stepCount = 0;
	play = true;
	charCount = 0;
	$("#resolutionTable").html("");
	$(".pagination").html("");
}

function cleanPage() {
	$("#input")[0].value="";
	cleanValidation();
}

function testUppercase(c) {
	if (c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90) {
		return true;
	}
	return false;
}

function changeInput(inputx) {
	for (var i = 0; i < inputx.length; i++) {
		if (testUppercase(inputx[i])) {
			return true;
		}
	}
	return false;
}

function getRandom(value) {
	var result = Math.floor(Math.random() * value);
	return result;
}

function searchState(c) {
	var target = getRandom(states[c].size);
	return states[c][target];
}

function validateInput(input) {
	var result = "";

	for (var i = 0; i < input.length; i++) {
		var c = input[i];

		if (testUppercase(c)) {
			var temp = searchState(c);
			result = result + temp;
		} else {
			result = result + c;
		}
	}
	return result;
}

function createNewString() {
	cleanPage();
	var input = "S";

	while (changeInput(input)) {
		$("div.input-group input").val(input);
		input = validateInput(input);
		console.log("input:" + input);
	}
	$("div.input-group input").val(input);
	return input;
}

function invert(target) {
	invertedTarget = target.split("").reverse().join("");
	return invertedTarget;
}

function execute() {
	if (shouldContinue) {
		var last = input.stack[input.stack.length - 1];
		var first = input.value[0];
		var html = "<tr> <td>" + '$' + input.stack + "</td> <td>" + input.value + '$' + "</td>";

		stepCount++;

		if (last == first) {

			input.stack = input.stack.substring(0, input.stack.length - 1);
			input.value = input.value.substring(1, input.value.length);

			if (first != null && last != null) {
				html += "<td>Lê " + first + "</td> </tr>";
				$("#char" + charCount).addClass("char-ok");
				charCount++;
			} else {
				html += "<td>Ok em " + stepCount + "</td> </tr>";
				shouldContinue = false;
			}
		} else {
			var target = last + first;

			if (target != null) {
				var targetId = $("#" + target).text();
				console.log("Target["+target+"] >> " + targetId);
				
				if (targetId.length == 0) {
					html += "<td>Erro em " + stepCount + "</td> </tr>";
					$("#char" + charCount).addClass("char-error");
					charCount++;
					shouldContinue = false;
				} else {
					var targetSplit = targetId.split("-> ")
					
					if (targetSplit.length == 2) {
						var targetOk = targetSplit[1];

						invert(targetOk);

						if ("E" == invertedTarget) {
							invertedTarget = "";
						}

						input.stack = input.stack.substring(0, input.stack.length - 1);
						input.stack = input.stack + invertedTarget;
						html += "<td> " + targetId + "</td> </tr>";

					} else {
						console.log("Erro 1");
					}
				}
			} else {
				console.log("Erro 2");
			}
		}

		$("#resolutionTable").append(html);
		window.scrollTo(0, window.scrollMaxY);
	}
}