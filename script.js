const apiKey = 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

document.getElementById('start-btn').addEventListener('click', () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'ja-JP';
  recognition.start();

  recognition.onresult = async (event) => {
    const userInput = event.results[0][0].transcript;
    document.getElementById('user-text').textContent = "ユーザー: " + userInput;

    // ChatGPTへ問い合わせ
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userInput }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      const aiText = data.choices[0].message.content;
      document.getElementById('ai-response').textContent = "AI: " + aiText;

      // 音声読み上げ
      const utter = new SpeechSynthesisUtterance(aiText);
      utter.lang = "ja-JP";
      speechSynthesis.speak(utter);
    } catch (err) {
      alert("エラーが発生しました：" + err.message);
    }
  };

  recognition.onerror = (event) => {
    alert("音声認識エラー: " + event.error);
  };
});
