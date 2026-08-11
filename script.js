document.addEventListener('DOMContentLoaded', function() {

    const searchButton = document.getElementById('search-btn');
    const usernameInput = document.getElementById('user-input');

    const statsContainer = document.querySelector('.stats-container');

    const easyProgressCircle =
        document.querySelector('.easy-progress');

    const mediumProgressCircle =
        document.querySelector('.medium-progress');

    const hardProgressCircle =
        document.querySelector('.hard-progress');

    const easyLabel =
        document.getElementById('easy-label');

    const mediumLabel =
        document.getElementById('medium-label');

    const hardLabel =
        document.getElementById('hard-label');

    const cardStatsContainer =
        document.querySelector('.stats-card');


    function validateUsername(username) {

        if (username.trim() === '') {
            alert('Please enter a username.');
            return false;
        }

        const regex = /^[a-zA-Z0-9_]{1,15}$/;

        const isMatching = regex.test(username);

        if (!isMatching) {

            alert(
                'Invalid username. Please enter a valid username (1-15 characters, letters, numbers, and underscores only).'
            );

        }

        return isMatching;
    }


    async function fetchUserData(username) {

        try {

            searchButton.textContent = 'Searching...';
            searchButton.disabled = true;


            const response = await fetch(
                `http://localhost:3000/api/user/${username}`
            );


            if (!response.ok) {
                throw new Error('Network response was not ok');
            }


           const parsedData = await response.json();
           console.log('Fetched data:', parsedData);
           displayUserData(parsedData);


        } catch (error) {

            console.error(
                'Error fetching user data:',
                error
            );

            statsContainer.innerHTML =
                `<p>No data found</p>`;


        } finally {

            searchButton.textContent = 'Search';
            searchButton.disabled = false;

        }
    }
    function updateProgress(solved, total,  label,circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty('--progress-degree', `${progressDegree}%`);
        label.textContent = `${solved} / ${total}`;
    }
    function displayUserData(parsedData) {
        const totalQues= parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues= parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues= parsedData.data.allQuestionsCount[2].count;
        const totalHardQues= parsedData.data.allQuestionsCount[3].count;
        const solvedTotalQues= parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedEasyQues= parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedMediumQues= parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedHardQues= parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;
        updateProgress(solvedEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHardQues, totalHardQues, hardLabel, hardProgressCircle); 
        
        const cardData = [
    {
        label: "Overall Submission",
        value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions
    },
    {
        label: "Easy Submission",
        value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions
    },
    {
        label: "Medium Submission",
        value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions
    },
    {
        label: "Hard Submission",
        value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions
    }
];
        console.log(cardData);
        cardStatsContainer.innerHTML = cardData.map(data => {
            return `<div class="card">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
            </div>`;
        }).join('');
    }

    searchButton.addEventListener('click', function() {

        const username = usernameInput.value;

        console.log(
            'login username:',
            username
        );


        if (!validateUsername(username)) {
            return;
        }


        fetchUserData(username);

    });

});