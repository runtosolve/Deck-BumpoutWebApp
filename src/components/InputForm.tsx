"use client";

import { useState } from "react";
import { P_VALS, J_MIN, J_MAX, W_MIN, W_MAX } from "@/lib/constants";

export interface FormValues {
  p_psf: string;
  j_ft: string;
  W_ft: string;
}

const DEFAULTS: FormValues = {
  p_psf: "50",
  j_ft: "10",
  W_ft: "13",
};

interface InputFormProps {
  onSubmit: (values: FormValues) => void;
  loading: boolean;
  onChange?: (values: FormValues) => void;
}

export default function InputForm({ onSubmit, loading, onChange }: InputFormProps) {
  const [values, setValues] = useState<FormValues>(DEFAULTS);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormValues, string>> = {};

    const p = Number(values.p_psf);
    if (!P_VALS.includes(p as typeof P_VALS[number])) {
      newErrors.p_psf = `Must be one of: ${P_VALS.join(", ")}`;
    }

    const j = Number(values.j_ft);
    if (!values.j_ft.trim() || isNaN(j) || j < J_MIN || j > J_MAX || !Number.isInteger(j)) {
      newErrors.j_ft = `Whole number from ${J_MIN} to ${J_MAX}`;
    }

    const w = Number(values.W_ft);
    if (!values.W_ft.trim() || isNaN(w) || w < W_MIN || w > W_MAX || !Number.isInteger(w)) {
      newErrors.W_ft = `Whole number from ${W_MIN} to ${W_MAX}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(key: keyof FormValues, val: string) {
    const newValues = { ...values, [key]: val };
    setValues(newValues);
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    onChange?.(newValues);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Load dropdown */}
        <div>
          <label htmlFor="p_psf" className="block text-lg font-bold text-gray-800 mb-1">
            Floor Load <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
          <div className="flex rounded-lg overflow-hidden border-2 border-gray-300 focus-within:border-blue-600">
            <select
              id="p_psf"
              value={values.p_psf}
              onChange={(e) => handleChange("p_psf", e.target.value)}
              className="flex-1 px-4 py-4 text-xl text-gray-900 bg-white outline-none min-w-0 appearance-none"
              aria-required
            >
              {P_VALS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className="flex items-center px-4 bg-gray-100 text-gray-600 text-lg font-semibold border-l-2 border-gray-300 whitespace-nowrap">
              PSF
            </span>
          </div>
          {errors.p_psf && (
            <p className="mt-1 text-base text-red-600 font-semibold" role="alert">{errors.p_psf}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">Total load on the deck (dead + live).</p>
        </div>

        {/* Joist span */}
        <div>
          <label htmlFor="j_ft" className="block text-lg font-bold text-gray-800 mb-1">
            Joist Span <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
          <div className="flex rounded-lg overflow-hidden border-2 border-gray-300 focus-within:border-blue-600">
            <input
              id="j_ft"
              type="number"
              inputMode="numeric"
              min={J_MIN}
              max={J_MAX}
              step={1}
              placeholder="10"
              value={values.j_ft}
              onChange={(e) => handleChange("j_ft", e.target.value)}
              className="flex-1 px-4 py-4 text-xl text-gray-900 bg-white outline-none min-w-0"
              aria-required
            />
            <span className="flex items-center px-4 bg-gray-100 text-gray-600 text-lg font-semibold border-l-2 border-gray-300 whitespace-nowrap">
              ft
            </span>
          </div>
          {errors.j_ft && (
            <p className="mt-1 text-base text-red-600 font-semibold" role="alert">{errors.j_ft}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Distance from carry beam to outer box beam ({J_MIN}–{J_MAX} ft).
          </p>
        </div>

        {/* Bumpout width */}
        <div>
          <label htmlFor="W_ft" className="block text-lg font-bold text-gray-800 mb-1">
            Bumpout Width <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
          <div className="flex rounded-lg overflow-hidden border-2 border-gray-300 focus-within:border-blue-600">
            <input
              id="W_ft"
              type="number"
              inputMode="numeric"
              min={W_MIN}
              max={W_MAX}
              step={1}
              placeholder="13"
              value={values.W_ft}
              onChange={(e) => handleChange("W_ft", e.target.value)}
              className="flex-1 px-4 py-4 text-xl text-gray-900 bg-white outline-none min-w-0"
              aria-required
            />
            <span className="flex items-center px-4 bg-gray-100 text-gray-600 text-lg font-semibold border-l-2 border-gray-300 whitespace-nowrap">
              ft
            </span>
          </div>
          {errors.W_ft && (
            <p className="mt-1 text-base text-red-600 font-semibold" role="alert">{errors.W_ft}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Side-to-side width of the bumpout ({W_MIN}–{W_MAX} ft). Posts at corners.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 px-6 text-2xl font-bold text-white rounded-xl
            bg-green-600 hover:bg-green-700 active:bg-green-800
            disabled:bg-gray-400 disabled:cursor-not-allowed
            transition-colors focus:outline-none focus:ring-4 focus:ring-green-400"
        >
          {loading ? "CALCULATING..." : "CALCULATE"}
        </button>
      </div>
    </form>
  );
}
