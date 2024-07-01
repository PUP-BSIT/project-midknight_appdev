const emailStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
    
    body {
        font-family: 'Montserrat', sans-serif;
        background-color: #f8f8f8;
        margin: 0;
        padding: 0;
        width: 100%;
        overflow-x: hidden;
    }

    .container {
        background-color: #E2D6C8;
        padding: 20px 100px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        font-family: 'Montserrat', sans-serif;
        width: 100%;
        max-width: 600px;
        margin: auto;
    }

    .logo {
        text-align: center;
        margin-bottom: 20px;
    }

    .logo img {
        max-width: 200px;
        width: 100%;
        height: auto;
    }

    .content {
        text-align: center;
        background-color: #f0f0f0;
        padding: 20px;
        border-radius: 10px;
        max-width: 100%;
        box-sizing: border-box;
    }

    .content h1 {
        color: #4D493E;
        font-size: 24px;
        margin: 10px 0;
    }
        
    .content p {
        color: #8E7C70;
        font-size: 16px;
        margin: 20px 0;
    }

    .content .mail, .content .team {
        color: #3E3E3E;
        text-decoration: none;
        font-weight: bold;
    }

    .content .mail:hover {
        text-decoration: underline;
    }

    button {
        font-size: large;
        padding: 10px;
        width: 60%;
        background-color: #3E3E3E;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button a {
        color: #FFF !important;
        text-decoration: none;
    }
        
    button:hover {
        background-color: #555;
    }
`;

module.exports = emailStyles;
