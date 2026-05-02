"use client";

import { useState } from "react";
import InputForm, { FormValues } from "@/components/InputForm";
import ResultsDisplay, { DesignResult } from "@/components/ResultsDisplay";
import DiagramGuide from "@/components/DiagramGuide";

export default function Home() {
  const [result, setResult] = useState<DesignResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentValues, setCurrentValues] = useState<FormValues | null>(null);

  function handleValuesChange(values: FormValues) {
    setCurrentValues(values);
  }

  async function handleCalculate(values: FormValues) {
    setLoading(true);
    setApiError(null);
    setResult(null);

    const body = {
      p_psf: Number(values.p_psf),
      j_ft: Number(values.j_ft),
      W_ft: Number(values.W_ft),
    };

    try {
      const res = await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok && res.status !== 422) {
        const text = await res.text();
        setApiError(`Server error (${res.status}): ${text}`);
        return;
      }

      const data: DesignResult = await res.json();
      setResult(data);

      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Network error. Check your connection."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          HBAM Bumpout Designer
        </h1>
        <p className="mt-2 text-lg text-white">
          Simplified span tables — enter joist span and bumpout width to size members.
        </p>
      </header>

      {/* Input Form */}
      <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
          Enter Your Dimensions
        </h2>
        <InputForm onSubmit={handleCalculate} loading={loading} onChange={handleValuesChange} />
      </section>

      {/* Diagram Guide */}
      <section className="mb-8">
        <DiagramGuide values={currentValues || undefined} />
      </section>

      {/* API error */}
      {apiError && (
        <div
          className="mb-8 flex gap-3 items-start bg-red-50 border-2 border-red-500 rounded-xl px-5 py-4"
          role="alert"
        >
          <span className="text-red-600 text-2xl flex-shrink-0 font-bold">!</span>
          <div>
            <p className="text-lg font-bold text-red-800">Could not complete calculation</p>
            <p className="text-base text-red-700 mt-1">{apiError}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <section
          id="results-section"
          className="bg-white rounded-2xl shadow-md p-6 sm:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
            Results
          </h2>
          <ResultsDisplay result={result} />
        </section>
      )}
    </main>
  );
}
