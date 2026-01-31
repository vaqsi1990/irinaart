export type Exhibition = {
  id: number
  image: string
  title: string
  date: string
  location: string
  description: string
}

export const exhibitions: Exhibition[] = [
  {
    id: 1,
    image: "/615870184_1493962962736357_6308310756661494169_n.jpg",
    title: "ხელოვნების გალერეა",
    date: "2025 წელი",
    location: "თბილისი",
    description:
      "პერსონალური გამოფენა თანამედროვე ხელოვნების ნიმუშებით. ნამუშევრები ხელმისაწვდომია ვიზიტისთვის.",
  },
  {
    id: 2,
    image: "/619185382_1496625222470131_5424354655690149590_n.jpg",
    title: "საზაფხულო ვერნისაჟი",
    date: "2025 წლის ივნისი",
    location: "გალერეა N ART",
    description:
      "სეზონური გამოფენა — ნატურმორტები, პორტრეტები და აბსტრაქტული კომპოზიციები.",
  },
]
