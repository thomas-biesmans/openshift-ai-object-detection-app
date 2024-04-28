import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { Ollama } from 'ollama/dist/browser.mjs'

function OllamaText({ labels }) {
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const ollama = new Ollama({ host: 'http://ollama-route-ollama.apps.rosa.gd2.jo1y.p3.openshiftapps.com', });
        const fetchResponse = async () => {
            setLoading(true);
            const userInput = `
I am living in a fictive world. 
I will use the following list of objects to generate captivating stories used as subtitles in videos. 
${labels.join(',')}. 
Make it fun and short. 
The sentence generated should refer to the objects, and use funny real life expressions 
but that are not vulgar or insulting. 
The style should use social media type of conversation. 
The context should be fun. 
It relates to promoting the scene as if we were exploring a new place. 
For example, I am in a fabulous place, it's sunny and so on. 
Do not use words that identify someone by gender, sex, origin or address them too informally. 
Do not use emojis.
Limit response to one idea, not multiple options.
Remove hashtags words.
`
            const message = { role: 'user', content: userInput }
            const response = await ollama.chat({ model: 'mistral', messages: [message], stream: true })

            let responseBuffer = '';
            let isPhraseEnd = false;

            for await (const part of response) {
                setLoading(false);
                responseBuffer += part.message.content;

                isPhraseEnd = part.message.content.trim().endsWith('.') || part.message.content.trim().endsWith('?') || part.message.content.trim().endsWith('!');

                const sentenceParts = responseBuffer.trim().split(',');
                responseBuffer = responseBuffer.replace(',', '')
                responseBuffer = responseBuffer.replace('.', '')

                const words = responseBuffer.trim().split(' ');

                const isSentencePart = sentenceParts.length > 1;
                const isTooLong = words.length > 8;
                const startsWithAlphabetical = /^[a-zA-Z]/.test(responseBuffer.trim());

                if ((isTooLong || isSentencePart) && startsWithAlphabetical) {
                    setResponse(responseBuffer);
                    responseBuffer = '';
                    await new Promise((resolve) => setTimeout(resolve, 4000)); // Add a 500ms pause
                }

                if (isPhraseEnd) {
                    setResponse(responseBuffer);
                    responseBuffer = '';
                    isPhraseEnd = false;
                    await new Promise((resolve) => setTimeout(resolve, 4000)); // Add a 500ms pause
                    setResponse('');

                }
            }

            if (responseBuffer) {
                setResponse(responseBuffer);
            }
        };

        fetchResponse();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <p>{response}</p>
            )}
        </div >
    );
}

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(OllamaText);
