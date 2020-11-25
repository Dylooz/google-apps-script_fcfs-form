/*
Copyright 2020 Dylan Burns
Permission to use, copy, modify, and/or
distribute this software for any purpose with
or without fee is hereby granted, provided that
the above copyright notice and this permission
notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR
DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE
AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT,
OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER
RESULTING FROM LOSS OF USE, DATA OR PROFITS,
WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR 
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN 
CONNECTION WITH THE USE OR PERFORMANCE OF 
THIS SOFTWARE.
*/

/*
USE INSTRUCTIONS:
1) Open the form you wish to use this on.
2) Click the 3 dots icon near your profile picture.
3) Select "Script Editor".
4) Paste this code and adjust the question number if necessary.
5) Hit save.
6) Select "Edit > Current Project's Triggers".
7) Press "Add Trigger" in the bottom right corner.
8) Make sure your settings are as follows:
      
      Choose which function to run:         onSubmitHandle
      Choose which deployment should run:   Head
      Select event source:                  From form
      Select event type:                    On form submit
      
      Failure notification can be set to whatever you want.
      There shouldn't be any errors.
9) Hit save.
The application should now be configured and active.
*/

// -- First come, first serve, form creator -- //

const question_number = 5; // The question number to apply the effect to.

// -- Main function, executed every time the form is submitted -- //

function onSubmitHandle(e) {
  
  const form = FormApp.getActiveForm(); // Find form to apply effect to
  const question = form.getItems()[question_number - 1]; // Find question to apply effect to
  const res = e.response.getResponseForItem(question); // Get the user response to question
  
  if (res === null) { // If the question is optional and no response is given
    
    Logger.log("No role selected");
    // DO NOTHING
  
  } else {
    
    const role = res.getResponse(); // Extract the textual response from the question
    Logger.log(role);
    
    const multiple_choice = question.asMultipleChoiceItem(); // Extract the question as a list of options
    const choices = multiple_choice.getChoices(); // Extract the options
    Logger.log(choices[0]);
    const choices_new = [];
    choices.forEach(c => { if (c.getValue() != role) { choices_new.push(c); }; }); // Create a new array containing all the old options
                                                                                   // Except the one the user chose
    if (choices_new.length == 0) { 
        choices_new.push(multiple_choice.createChoice("All Roles Taken"));
        multiple_choice.setTitle("Sorry, all speaking roles have been taken.");
        question.setHelpText("Sorry, all speaking roles have been taken.");
    }
  
    multiple_choice.setChoices(choices_new); // Set the list of choices equal to the new array
  
    if (question.getHelpText() == "") { // If the list of taken roles is empty
    
      question.setHelpText("Taken Roles:\n  -" + role + "\n"); // Create a small text widget displaying taken roles
    
    } else {
    
      question.setHelpText(question.getHelpText() + "  -" + role + "\n"); // Add a new entry to the list displaying the newly taken role
    
    }
  
  }

}
