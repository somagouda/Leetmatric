const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/user/:username', async (req, res) => {

    const username = req.params.username;

    const targetUrl = 'https://leetcode.com/graphql/';

    const query = `
        query userSessionProgress($username: String!) {
            allQuestionsCount {
                difficulty
                count
            }

            matchedUser(username: $username) {
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }

                    totalSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
            }
        }
    `;

    const variables = {
        username: username
    };

    try {

        const response = await fetch(targetUrl, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        if (!response.ok) {
            throw new Error(
                `LeetCode returned status ${response.status}`
            );
        }

        const parsedData = await response.json();

        res.json(parsedData);

    } catch (error) {

        console.error('Error:', error);

        res.status(500).json({
            error: 'Failed to fetch LeetCode data'
        });
    }
});


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});