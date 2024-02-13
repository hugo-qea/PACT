let myQuestions = [
    {
      question: "Je préfère ...",
      answers: {
        b: 'conduire',
        a: 'cuisiner',
        c: 'écrire'
      },
      bakerAnswer: 'a',
      railroaderAnswer: 'b',
      journalistAnswsr:'c'
    },
    
    {
      question: "Je suis plutôt ...",
      answers: {
        c: 'curieux',
        a: 'créatif',
        b: 'attentif',

      },
      bakerAnswer: 'a',
      railroaderAnswer: 'b',
      journalistAnswsr:'c'
    },
    
    {
      question: "J'aimerais un travail ...",
      answers: {
        a: 'manuel ou artisanal',
        c: 'qui me permet de rechercher et découvrir des choses',
        b: 'avec des responsabilités importantes',

      },
      bakerAnswer: 'a',
      railroaderAnswer: 'b',
      journalistAnswsr:'c'
    },
    
    {
      question: "D'un point de vue relationnel, je suis plus à l'aise ...",
      answers: {
        a: 'pour vendre et faire plaisir',
        c: 'pour écouter et échanger',
        b: 'en étant seul et en aidant',

      },
      bakerAnswer: 'a',
      railroaderAnswer: 'b',
      journalistAnswsr:'c'
    },
    
      {
      question: "Dans mon travail, j'aimerais utiliser et développer ...",
      answers: {

        b: 'ma réactivité',
        c: 'mon esprit critique',
        a: 'mon habileté'
      },
      bakerAnswer: 'a',
      railroaderAnswer: 'b',
      journalistAnswsr:'c'
    },
    
       {
      question: "Cela ne me dérange pas de ...",
      answers: {

        b: 'faire des horaires décalés',
        a: 'mettre à l\'épreuve mon endurance physique',
        c: 'm\'adapter à des situations inédites',
      },
      bakerAnswer: 'a',
      railroaderAnswer: 'b',
      journalistAnswsr:'c'
    }
    
    
  ];
  
  let quizContainer = document.getElementById('quiz');
  let resultsContainer = document.getElementById('results');
  let submitButton = document.getElementById('submit');
  
  generateQuiz(myQuestions, quizContainer, resultsContainer, submitButton);
  
  function generateQuiz(questions, quizContainer, resultsContainer, submitButton){
  
    function showQuestions(questions, quizContainer){
      // we'll need a place to store the output and the answer choices
      let output = [];
      let answers;
  
      // for each question...
      for(let i=0; i<questions.length; i++){
        
        // first reset the list of answers
        answers = [];
  
        // for each available answer...
        for(letter in questions[i].answers){
  
          // ...add an html radio button
          answers.push(
            '<label>'
              + '<input type="radio" name="question'+i+'" value="'+letter+'">'
            
              + questions[i].answers[letter]
            + '</label>'
          );
        }
  
        // add this question and its answers to the output
        output.push(
          '<div class="question">' + questions[i].question + '</div>'
          + '<div class="answers">' + answers.join('') + '</div>'
        );
      }
      
      
  
      // finally combine our output list into one string of html and put it on the page
      quizContainer.innerHTML = output.join('');
    }
  
  
    function showResults(questions, quizContainer, resultsContainer){
      
      // gather answer containers from our quiz
      let answerContainers = quizContainer.querySelectorAll('.answers');
      
  
     let listAnswers = [];
      
      
      // keep track of user's answers
      let userAnswer = '';
      let numCorrect = 0;
      
      // for each question...
      for(let i=0; i<questions.length; i++){
  
        // find selected answer
        userAnswer = (answerContainers[i].querySelector('input[name=question'+i+']:checked')||{}).value;
        
        
        listAnswers.push(userAnswer);
  
        
        
        
        // if answer is correct
        if(userAnswer===questions[i].correctAnswer){
          // add to the number of correct answers
          numCorrect++;
        }
        }
      
        let numBaker = listAnswers.filter(x => x=="a").length;
        let numRailroader = listAnswers.filter(x => x=="b").length;
        let numJournalist = listAnswers.filter(x => x=="c").length;
      
      let rightAnswers = new Map();
      rightAnswers.set(numBaker, 'Boulanger');
      rightAnswers.set(numRailroader, 'Cheminot');
      rightAnswers.set(numJournalist, 'Journaliste');
      
      listJobs = [numBaker, numRailroader, numJournalist];
      listJobs.sort().reverse();
      
      
      
      // find the corresponding job
      correspondingJob = rightAnswers.get(listJobs[0]);
      
      //find the second corresponding job
      listJobs.shift()
      secondJob = rightAnswers.get(listJobs[0])
      
          // show number of correct answers out of total
      resultsContainer.innerHTML = 'D\'après vos réponses, le métier de ' +correspondingJob+ ' semble être celui qui vous correspond le plus. ' + 'L\'emploi qui est arrivé en seconde place est celui de ' + secondJob + '. ';
      }
  
          // show questions right away
    showQuestions(questions, quizContainer);
  
      // on submit, show results
    submitButton.onclick = function(){
      showResults(questions, quizContainer, resultsContainer);
    }
  }