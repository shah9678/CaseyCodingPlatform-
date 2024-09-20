type PersonalityTheme = {
  background: string;
  cardBackground: string;
  text: string;
  input: string;
  button: string;
  textarea: string;
  monacoTheme: string;
};

const themes: Record<string, PersonalityTheme> = {
  openness: {
    background: "bg-gradient-to-br from-purple-400 to-indigo-600",
    cardBackground: "bg-white/90 backdrop-blur-sm",
    text: "text-purple-900",
    input: "border-purple-300 focus:border-purple-500 bg-purple-50",
    button:
      "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white",
    textarea: "bg-purple-50 border-purple-200",
    monacoTheme: "vs-dark",
  },
  conscientiousness: {
    background: "bg-gradient-to-br from-blue-400 to-cyan-600",
    cardBackground: "bg-white/90 backdrop-blur-sm",
    text: "text-blue-900",
    input: "border-blue-300 focus:border-blue-500 bg-blue-50",
    button:
      "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white",
    textarea: "bg-blue-50 border-blue-200",
    monacoTheme: "vs-light",
  },
  extraversion: {
    background: "bg-gradient-to-br from-yellow-400 to-orange-600",
    cardBackground: "bg-white/90 backdrop-blur-sm",
    text: "text-yellow-900",
    input: "border-yellow-300 focus:border-yellow-500 bg-yellow-50",
    button:
      "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white",
    textarea: "bg-yellow-50 border-yellow-200",
    monacoTheme: "vs",
  },
  agreeableness: {
    background: "bg-gradient-to-br from-green-400 to-emerald-600",
    cardBackground: "bg-white/90 backdrop-blur-sm",
    text: "text-green-900",
    input: "border-green-300 focus:border-green-500 bg-green-50",
    button:
      "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white",
    textarea: "bg-green-50 border-green-200",
    monacoTheme: "hc-light",
  },
  neuroticism: {
    background: "bg-gradient-to-br from-red-400 to-pink-600",
    cardBackground: "bg-white/90 backdrop-blur-sm",
    text: "text-red-900",
    input: "border-red-300 focus:border-red-500 bg-red-50",
    button:
      "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white",
    textarea: "bg-red-50 border-red-200",
    monacoTheme: "hc-black",
  },
};

export function getPersonalityTheme(personality: string): PersonalityTheme {
  return themes[personality] || themes.openness;
}
