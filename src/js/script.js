;$(function() {
    var $userInput = $("#userInput");
    var $maskChar = $("#maskChar");
    var $amountReplace = $("#amount");
    var $button = $("#button");

    var skype ='skype:';
    var pattEmail = /\S+@\S+\.\S+/;
    var patt = /[^a-zA-Z0-9]/;

    function emailCheck(email) {
        return pattEmail.test(email);
    }

    function replacerEmail(email, mask) {
        var userEmailStart = email.search(pattEmail);
        var userEmailFinish = email.indexOf('@');
        var wordLength = email.slice(userEmailStart + 1,  userEmailFinish - 1).length;
       return email.replace(email.substring(userEmailStart + 1,  userEmailFinish - 1), mask.repeat(wordLength));
    }

    function replacerSkype(userSkype, mask, pos) {


    }

    $button.on('click', function() {
        var userInput = $userInput.val();
        var maskChar = $maskChar.val();
        var pos = 0;

        if (emailCheck(userInput)) {
            $userInput.val(replacerEmail(userInput, maskChar));
        }

        if (~userInput.indexOf(skype)) {
            var startUserS = userInput.slice(0, userInput.indexOf(skype) + skype.length);
            var startUserP = pos + skype.length;
            var finishUserP = userInput.slice(0, userInput.indexOf(skype) + skype.length).search(patt);
            var finishUserS = userInput.slice(pos + skype.length).slice(startUserP + finishUserP);

            $userInput.val(startUserS + maskChar + finishUserS);
        }
    });
});