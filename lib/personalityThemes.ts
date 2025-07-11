type PersonalityTheme = {
  select: string;
  label: string;
  background: string;
  cardBackground: string;
  text: string;
  input: string;
  button: string;
  textarea: string;
  monacoTheme: string;
  accent: string;
};

const themes: Record<string, PersonalityTheme> = {
  openness: {
    background: "bg-gradient-to-br from-purple-400 to-indigo-600",
    cardBackground: "bg-white/90 backdrop-blur-sm",
    text: "text-purple-900",
    input: "border-purple-300 focus:border-purple-500 bg-purple-50",
    button: "bg-purple-600 hover:bg-purple-700 text-white",
    textarea: "bg-purple-50 border-purple-200",
    monacoTheme: "vs-dark",
    accent: "text-indigo-500",
  },
  conscientiousness: {
    background: "bg-gradient-to-br from-blue-400 to-cyan-600",
    cardBackground: "bg-white/90 backdrop-blur-sm",
    text: "text-blue-900",
    input: "border-blue-300 focus:border-blue-500 bg-blue-50",
    button: "bg-blue-600 hover:bg-blue-700 text-white",
    textarea: "bg-blue-50 border-blue-200",
    monacoTheme: "vs-light",
    accent: "text-cyan-500",
  },
  extraversion: {
    background: "bg-gradient-to-br from-yellow-400 to-orange-600",
    cardBackground: "bg-white/90 backdrop-blur-sm",
    text: "text-yellow-900",
    input: "border-yellow-300 focus:border-yellow-500 bg-yellow-50",
    button: "bg-orange-600 hover:bg-orange-700 text-white",
    textarea: "bg-yellow-50 border-yellow-200",
    monacoTheme: "vs",
    accent: "text-orange-500",
  },
  agreeableness: {
    background: "bg-gradient-to-br from-green-400 to-emerald-600",
    cardBackground: "bg-white/90 backdrop-blur-sm",
    text: "text-green-900",
    input: "border-green-300 focus:border-green-500 bg-green-50",
    button: "bg-emerald-600 hover:bg-emerald-700 text-white",
    textarea: "bg-green-50 border-green-200",
    monacoTheme: "hc-light",
    accent: "text-emerald-500",
  },
  neuroticism: {
    background: "bg-gradient-to-br from-red-400 to-pink-600",
    cardBackground: "bg-white/90 backdrop-blur-sm",
    text: "text-red-900",
    input: "border-red-300 focus:border-red-500 bg-red-50",
    button: "bg-red-600 hover:bg-red-700 text-white",
    textarea: "bg-red-50 border-red-200",
    monacoTheme: "hc-black",
    accent: "text-pink-500",
  },
};

export function getPersonalityTheme(personality: string): PersonalityTheme {
  return themes[personality] || themes.openness;
}
