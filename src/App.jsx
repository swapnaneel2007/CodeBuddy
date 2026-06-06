import React, { useState } from 'react'
import "./App.css"
import Navbar from './components/Navbar';
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

const App = () => {
  const options = [
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'sql', label: 'SQL' },
    { value: 'dart', label: 'Dart' }
  ];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6Iq59eo2-6NViuHEV-3Ye1VQg8Yd6Co5XRAcV4g0DIERw" });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const [code, setCode] = useState("// Write your code here");

  async function reviewCode() {
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are a Senior Software Engineer with 15+ years of experience in software development, code reviews, system design, security, and performance optimization.

Review the following code thoroughly. Identify bugs, logical errors, performance issues, security vulnerabilities, and scalability concerns. Provide detailed feedback on code quality, maintainability, and adherence to best practices. Suggest improvements and optimizations where necessary.

I am sharing a code snippet in ${selectedOption.value} that I want you to review.
Code: ${code}

Provide feedback in the following format:

1. Code Summary
   - Explain what the code does.
   - Mention the overall quality.

2. Bugs & Logical Errors
   - Identify bugs, edge cases, and potential runtime errors.
   - Explain why they occur.
   - Suggest fixes.

3. Performance Analysis
   - Find inefficient algorithms or operations.
   - Mention time and space complexity.
   - Suggest optimized alternatives.

4. Code Quality & Maintainability
   - Check naming conventions.
   - Check code structure and readability.
   - Identify duplicated code.
   - Suggest refactoring opportunities.

5. Best Practices
   - Check adherence to language-specific best practices.
   - Suggest cleaner and more professional approaches.

6. Security Issues
   - Identify vulnerabilities.
   - Explain risks.
   - Suggest secure alternatives.

7. Scalability Concerns
   - Explain how the code would behave with large inputs.
   - Suggest improvements.

8. Error Handling
   - Identify missing exception handling.
   - Suggest better error management.

9. Testing Recommendations
   - Suggest unit tests.
   - Mention edge cases that should be tested.

10. Improved Version
    - Provide a rewritten version of the code incorporating all improvements.

11. Review Score
    - Rate the code out of 10.
    - Explain the rating.

Be specific and provide code examples wherever necessary.`,
    });

    console.log(response);
    setResponse(response.text);
    setLoading(false);
  }
  const [fixedCode, setFixedCode] = useState("");
  async function fixCode() {
    try {
      setLoading(true);

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `
Fix the following ${selectedOption.value} code.

Rules:
- Return ONLY the corrected code.
- No explanations.
- No markdown.
- No code fences.

Code: ${code}`,
      });
      console.log("Fix response:", response);
      console.log("Type:", typeof response.text);
      console.log("Text:", response.text);

      const cleanedCode = String(response.text)
        .replace(/```[\w]*\n?/g, "")
        .replace(/```/g, "")
        .trim();

      setFixedCode(cleanedCode);
      setActiveTab("fix");

    } catch (error) {
      console.error("Fix Code Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const [activeTab, setActiveTab] = useState("review");

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#1e1e1e",
      innerWidth: "20%",
      borderColor: state.isFocused ? "#555" : "#333",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#555",
      },
    }),

    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1e1e1e",
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#333" : "#1e1e1e",
      color: "#ffffff",
      cursor: "pointer",
    }),

    singleValue: (provided) => ({
      ...provided,
      color: "#ffffff",
    }),

    input: (provided) => ({
      ...provided,
      color: "#ffffff",
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#888",
    }),
  };
  return (
    <div>
      <Navbar />
      <div className="main flex items-center justify-between" style={{ height: "calc(100vh - 90px)" }}>
        <div className="left h-[85%] w-[50%]">
          <div className="tabs !mt-4 !px-4 !mb-3 w-full flex items-center gap-[50px]">
            <Select
              value={selectedOption}
              onChange={(e) => { setSelectedOption(e) }}
              options={options}
              styles={customStyles}
            />
            <button
              onClick={() => {
                if (code.trim() === "") {
                  alert("Please enter code");
                } else {
                  fixCode();
                }
              }}
              className="btnNormal bg-zinc-900 min w-[100px] h-[35px] transition-all hover:bg-zinc-800"
            >
              Fix Code
            </button>
            <button onClick={() => {
              if (code === "") {
                alert("Please enter code")
              }
              else {
                reviewCode()
              }
            }} className="btnNormal bg-zinc-900 min w-[150px] h-[35px] transition-all hover:bg-zinc-800">Review Code</button>
          </div>
          <Editor height="100%" theme='vs-dark' language="javascript" value={code} onChange={(e) => setCode(e)} />;
        </div>
        <div className="right overflow-y-auto !p-[10px] h-[100%] w-[50%] bg-zinc-900">
          <div className="topTab border-b-[1px] border-[#333] flex items-center justify-between h-[60px]">
            <p className='font-[750] text-[20px]'>
              {activeTab === "review" ? "Review" : "Fixed Code"}
            </p>

            {activeTab === "fix" && fixedCode && (
              <button
                onClick={() => setCode(fixedCode)}
                className="bg-green-700 px-4 py-2 rounded text-white hover:bg-green-600"
              >
                Apply Fix
              </button>
            )}
          </div>
          {loading && <p className="text-white mt-4">Loading...</p>}
          {activeTab === "review" ? (
            <Markdown>{response}</Markdown>
          ) : (

            <Editor
              height="100%"
              theme="vs-dark"
              language={selectedOption.value}
              value={fixedCode}
              options={{ readOnly: true }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App