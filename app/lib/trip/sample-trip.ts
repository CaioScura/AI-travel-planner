import type { Trip } from "./types";


//exemplod e roteiro com as coordenadas em tokyo
export const sampleTrip: Trip = {
  id: "toquio-3-dias",
  destination: "Tóquio, Japão",
  title: "Tóquio em 3 dias",
  days: [
    {
      id: "dia-1",
      label: "Dia 1",
      title: "Asakusa e Ueno",
      activities: [
        { id: "skytree", name: "Tokyo Skytree", category: "attraction", time: "09:00", note: "Suba cedo: em dias limpos dá para ver o Monte Fuji", coordinates: [139.8107, 35.7101] },
        { id: "sensoji", name: "Templo Sensō-ji", category: "attraction", time: "11:00", note: "O templo mais antigo de Tóquio; entre pelo portão Kaminarimon", coordinates: [139.7967, 35.7148] },
        { id: "ameyoko", name: "Ameya-Yokochō", category: "food", time: "13:00", note: "Mercado de rua com espetinhos, frutas e frutos do mar", coordinates: [139.7745, 35.7101] },
        { id: "ueno-park", name: "Parque Ueno", category: "attraction", time: "14:30", note: "Museus, templos e o lago Shinobazu", coordinates: [139.7714, 35.7148] },
        { id: "akihabara", name: "Akihabara", category: "attraction", time: "17:30", note: "Eletrônicos, anime e fliperamas", coordinates: [139.7731, 35.6984] },
        { id: "hotel-ueno", name: "Hotel em Ueno", category: "lodging", time: "20:00", note: "Check-in perto da estação de Ueno", coordinates: [139.7774, 35.7134] },
      ],
    },
    {
      id: "dia-2",
      label: "Dia 2",
      title: "Harajuku, Shibuya e Shinjuku",
      activities: [
        { id: "meiji", name: "Santuário Meiji", category: "attraction", time: "09:00", note: "Santuário xintoísta dentro de uma floresta na cidade", coordinates: [139.6993, 35.6764] },
        { id: "takeshita", name: "Takeshita-dōri", category: "attraction", time: "11:00", note: "A rua da moda jovem de Harajuku — prove um crepe", coordinates: [139.7031, 35.6716] },
        { id: "omotesando", name: "Café em Omotesandō", category: "cafe", time: "12:30", note: "Avenida arborizada cheia de cafés e lojas", coordinates: [139.7123, 35.6652] },
        { id: "shibuya", name: "Cruzamento de Shibuya", category: "attraction", time: "15:00", note: "Veja do alto, no mirante Shibuya Sky", coordinates: [139.7005, 35.6595] },
        { id: "omoide", name: "Omoide Yokochō", category: "food", time: "19:00", note: "Becos de izakayas com yakitori", coordinates: [139.6996, 35.6929] },
      ],
    },
    {
      id: "dia-3",
      label: "Dia 3",
      title: "Tsukiji, Ginza e Palácio",
      activities: [
        { id: "tsukiji", name: "Mercado Externo de Tsukiji", category: "food", time: "08:00", note: "Café da manhã com sushi fresco e tamagoyaki", coordinates: [139.7707, 35.6655] },
        { id: "hamarikyu", name: "Jardins Hama-rikyū", category: "attraction", time: "10:00", note: "Jardim tradicional com casa de chá à beira da água", coordinates: [139.7633, 35.66] },
        { id: "ginza", name: "Ginza", category: "attraction", time: "12:30", note: "Aos fins de semana a avenida principal fecha para pedestres", coordinates: [139.765, 35.6717] },
        { id: "palacio", name: "Jardins do Palácio Imperial", category: "attraction", time: "14:30", note: "Ruínas do antigo castelo de Edo; entrada gratuita", coordinates: [139.7528, 35.6852] },
        { id: "estacao-toquio", name: "Estação de Tóquio", category: "transport", time: "17:00", note: "Fachada histórica; daqui saem os trens-bala", coordinates: [139.7671, 35.6812] },
      ],
    },
  ],
};