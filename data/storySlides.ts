export type StorySlide = {
  id: number;
  image: string;
  alt: string;
  title: string;  
  location: string;
    
  date: string;
  /** Title can have a leading symbol (e.g. asterisk) */
  titlePrefix?: string;
  paragraphs: string[];
};

export const storySlides: StorySlide[] = [
  {
    id: 1,
    image: "/615870184_1493962962736357_6308310756661494169_n.jpg",
    alt: "ხელოვნების გალერეა",
    title: "ხელოვნების გალერეა",
    date: "2025 წელი",
    location: "თბილისი",
    paragraphs: [
      "პერსონალური გამოფენა თანამედროვე ხელოვნების ნიმუშებით. ნამუშევრები ხელმისაწვდომია ვიზიტისთვის.",
    ],
  },
  {
    id: 2,
    image: "/619185382_1496625222470131_5424354655690149590_n.jpg",
    alt: "საზაფხულო ვერნისაჟი",
    title: "საზაფხულო ვერნისაჟი",
    date: "2025 წლის ივნისი",
    location: "გალერეა N ART",
    paragraphs: [
      "სეზონური გამოფენა — ნატურმორტები, პორტრეტები და აბსტრაქტული კომპოზიციები.",
    ],
  },
];
