import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-1106',
    max_tokens: 150,
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: `It will be provided texts in english or spanish, with possible ortographical and grammatical errors, 
        you must answer in JSON format, your task is to correct and to return solutions, based in the "Real academia española"
        text is in spanish, or "Oxford English Dictionary", if text is in english, also you must give a 
        acurracy percentage to the user, if there is no error, you must return a congratulations message to the user,
        you should identify first what language it was written the text and answer in the language of the text provided.
        
        Output example: 
        {
            userScore: number,
            errors: string[] // [error -> solution] if there is no errors string should be empty
            message: string, // Use emojis and text to congratulate the use if so 
        }
        
        `,
      
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const jsonResp = JSON.parse(completion.choices[0].message.content)

  return jsonResp;
};
