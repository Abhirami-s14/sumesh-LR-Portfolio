/* ============================================================================
   CONTENT — the only file you need to edit.

   • Image paths are relative to the HTML pages, e.g. "images/lakeside-01.jpg".
   • An empty string ("") renders a labelled placeholder of the given ratio,
     so the layout always holds while images are still being produced.
   • Lists are data-driven: add or remove projects / renders / videos /
     panoramas and every page (slider counts, section index, galleries) adapts.
   • `ratio` only shapes placeholders. Real images keep their own proportions.

   EXTERIOR / INTERIOR renders
   • Each project entry is one subcategory (Apartments, Commercial, …). Its
     `slug` drives the filter and the page address (exterior.html#villa).
   • Every image records: file  = original filename in Portfolio.zip
                          order = display position (natural numeric sort)
                          src   = full-size web copy (lightbox, ≤2560px)
                          thumb = gallery copy (≤1100px)
                          w / h = pixel size of src (keeps the true aspect ratio)
   • Files live in images/renders/<category>/<subcategory>/{full,thumb}/.
   ========================================================================== */
window.SITE = {
  name: "SUMESH LR",
  role: "3D Architectural Visualizer",

  hero: {
    src: "images/hero.jpg",
    alt: "Upward view of a residential tower with undulating white balcony slabs against a clear blue sky",
    ratio: "16/9", slot: "Hero render"
  },

  about: {
    heading: "About me",
    body: [
      "Hey, I’m a 3D architectural visualizer with 6+ years of experience bringing spaces to life. I enjoy playing with lighting, materials, and little details that make a render feel real.",
      "I work with 3ds Max, Corona, and V-Ray, turning ideas into visuals that speak for themselves. For me, it’s all about getting the details right and creating something worth looking at.",
      "When I’m not working on renders, you’ll probably find me playing the violin or enjoying a game of cricket."
    ],
    portrait: { src: "images/portrait.jpg", alt: "Portrait of Sumesh LR in a white linen shirt, seated in a sunlit café", ratio: "2/3", slot: "Portrait" }
  },

  contact: {
    headline: "Let’s create something worth looking at.",
    support: "Have a project in mind? I’d love to hear about it.",
    email: "sumeshkrishna03@gmail.com",
    linkedin: "https://www.linkedin.com/in/sumesh-lr-677749369/",
    phone: "+91 80863 83698"
  },

  /* ---- The four categories ---------------------------------------------------
     Order here = order of the opening slides and of the page-to-page links.
     slide.src is the full-bleed image behind that category's opening slide.
  --------------------------------------------------------------------------*/
  categories: [
    {
      key: "exterior", page: "exterior.html", type: "projects",
      title: "Exterior", kicker: "Light that brings architecture to life.",
      blurb: "Bringing architectural visions to life through realistic lighting, detailed environments, and captivating perspectives.",
      slide: { src: "images/renders/exterior/apartments/full/5.jpg", alt: "Exterior render — residential tower silhouetted against a blazing sunset sky", focus: "38% 50%" },
      projects: [
        { title: "Apartments", slug: "apartments", folder: "Exterior/Apartments",
          images: [
            { file: "1.jpg", order: 1, src: "images/renders/exterior/apartments/full/1.jpg", thumb: "images/renders/exterior/apartments/thumb/1.jpg", w: 1728, h: 1602 },
            { file: "2.jpg", order: 2, src: "images/renders/exterior/apartments/full/2.jpg", thumb: "images/renders/exterior/apartments/thumb/2.jpg", w: 1673, h: 1602 },
            { file: "3.jpg", order: 3, src: "images/renders/exterior/apartments/full/3.jpg", thumb: "images/renders/exterior/apartments/thumb/3.jpg", w: 1529, h: 1602 },
            { file: "4.png", order: 4, src: "images/renders/exterior/apartments/full/4.jpg", thumb: "images/renders/exterior/apartments/thumb/4.jpg", w: 1920, h: 1440 },
            { file: "5.jpg", order: 5, src: "images/renders/exterior/apartments/full/5.jpg", thumb: "images/renders/exterior/apartments/thumb/5.jpg", w: 1920, h: 1080 },
            { file: "6.jpg", order: 6, src: "images/renders/exterior/apartments/full/6.jpg", thumb: "images/renders/exterior/apartments/thumb/6.jpg", w: 1920, h: 1080 },
            { file: "7.jpg", order: 7, src: "images/renders/exterior/apartments/full/7.jpg", thumb: "images/renders/exterior/apartments/thumb/7.jpg", w: 1920, h: 1080 },
            { file: "8.jpg", order: 8, src: "images/renders/exterior/apartments/full/8.jpg", thumb: "images/renders/exterior/apartments/thumb/8.jpg", w: 2000, h: 1500 },
            { file: "9.jpg", order: 9, src: "images/renders/exterior/apartments/full/9.jpg", thumb: "images/renders/exterior/apartments/thumb/9.jpg", w: 1700, h: 1791 },
            { file: "10.jpg", order: 10, src: "images/renders/exterior/apartments/full/10.jpg", thumb: "images/renders/exterior/apartments/thumb/10.jpg", w: 2219, h: 2384 },
            { file: "11.jpg", order: 11, src: "images/renders/exterior/apartments/full/11.jpg", thumb: "images/renders/exterior/apartments/thumb/11.jpg", w: 2273, h: 2442 },
            { file: "12.png", order: 12, src: "images/renders/exterior/apartments/full/12.jpg", thumb: "images/renders/exterior/apartments/thumb/12.jpg", w: 1920, h: 1080 },
            { file: "13.png", order: 13, src: "images/renders/exterior/apartments/full/13.jpg", thumb: "images/renders/exterior/apartments/thumb/13.jpg", w: 1920, h: 1080 },
            { file: "14.jpg", order: 14, src: "images/renders/exterior/apartments/full/14.jpg", thumb: "images/renders/exterior/apartments/thumb/14.jpg", w: 1920, h: 1080 },
            { file: "15.png", order: 15, src: "images/renders/exterior/apartments/full/15.jpg", thumb: "images/renders/exterior/apartments/thumb/15.jpg", w: 1920, h: 1080 },
            { file: "16.png", order: 16, src: "images/renders/exterior/apartments/full/16.jpg", thumb: "images/renders/exterior/apartments/thumb/16.jpg", w: 1920, h: 1080 },
            { file: "17.png", order: 17, src: "images/renders/exterior/apartments/full/17.jpg", thumb: "images/renders/exterior/apartments/thumb/17.jpg", w: 1920, h: 1080 },
            { file: "18.jpg", order: 18, src: "images/renders/exterior/apartments/full/18.jpg", thumb: "images/renders/exterior/apartments/thumb/18.jpg", w: 2200, h: 1977 },
            { file: "19.jpg", order: 19, src: "images/renders/exterior/apartments/full/19.jpg", thumb: "images/renders/exterior/apartments/thumb/19.jpg", w: 1500, h: 1348 },
            { file: "20.jpg", order: 20, src: "images/renders/exterior/apartments/full/20.jpg", thumb: "images/renders/exterior/apartments/thumb/20.jpg", w: 1800, h: 1200 }
          ] },
        { title: "Commercial", slug: "commercial", folder: "Exterior/Commerical",
          images: [
            { file: "1.jpg", order: 1, src: "images/renders/exterior/commercial/full/1.jpg", thumb: "images/renders/exterior/commercial/thumb/1.jpg", w: 2560, h: 1440 },
            { file: "2.jpg", order: 2, src: "images/renders/exterior/commercial/full/2.jpg", thumb: "images/renders/exterior/commercial/thumb/2.jpg", w: 2560, h: 1440 },
            { file: "3.jpg", order: 3, src: "images/renders/exterior/commercial/full/3.jpg", thumb: "images/renders/exterior/commercial/thumb/3.jpg", w: 2500, h: 1875 },
            { file: "4.jpg", order: 4, src: "images/renders/exterior/commercial/full/4.jpg", thumb: "images/renders/exterior/commercial/thumb/4.jpg", w: 2000, h: 1500 },
            { file: "5.jpg", order: 5, src: "images/renders/exterior/commercial/full/5.jpg", thumb: "images/renders/exterior/commercial/thumb/5.jpg", w: 2003, h: 2504 },
            { file: "6.jpg", order: 6, src: "images/renders/exterior/commercial/full/6.jpg", thumb: "images/renders/exterior/commercial/thumb/6.jpg", w: 1800, h: 1676 },
            { file: "7.jpg", order: 7, src: "images/renders/exterior/commercial/full/7.jpg", thumb: "images/renders/exterior/commercial/thumb/7.jpg", w: 2500, h: 1875 },
            { file: "8.jpg", order: 8, src: "images/renders/exterior/commercial/full/8.jpg", thumb: "images/renders/exterior/commercial/thumb/8.jpg", w: 2000, h: 1500 },
            { file: "9.jpg", order: 9, src: "images/renders/exterior/commercial/full/9.jpg", thumb: "images/renders/exterior/commercial/thumb/9.jpg", w: 2000, h: 1500 },
            { file: "10.jpg", order: 10, src: "images/renders/exterior/commercial/full/10.jpg", thumb: "images/renders/exterior/commercial/thumb/10.jpg", w: 1500, h: 1456 },
            { file: "11.jpg", order: 11, src: "images/renders/exterior/commercial/full/11.jpg", thumb: "images/renders/exterior/commercial/thumb/11.jpg", w: 1500, h: 1301 }
          ] },
        { title: "Hospitals", slug: "hospitals", folder: "Exterior/Hospitals",
          images: [
            { file: "1.png", order: 1, src: "images/renders/exterior/hospitals/full/1.jpg", thumb: "images/renders/exterior/hospitals/thumb/1.jpg", w: 1920, h: 1080 },
            { file: "2.png", order: 2, src: "images/renders/exterior/hospitals/full/2.jpg", thumb: "images/renders/exterior/hospitals/thumb/2.jpg", w: 1280, h: 720 },
            { file: "3.png", order: 3, src: "images/renders/exterior/hospitals/full/3.jpg", thumb: "images/renders/exterior/hospitals/thumb/3.jpg", w: 1920, h: 1080 },
            { file: "4.png", order: 4, src: "images/renders/exterior/hospitals/full/4.jpg", thumb: "images/renders/exterior/hospitals/thumb/4.jpg", w: 1920, h: 1080 },
            { file: "5.png", order: 5, src: "images/renders/exterior/hospitals/full/5.jpg", thumb: "images/renders/exterior/hospitals/thumb/5.jpg", w: 1280, h: 720 },
            { file: "6.jpg", order: 6, src: "images/renders/exterior/hospitals/full/6.jpg", thumb: "images/renders/exterior/hospitals/thumb/6.jpg", w: 1757, h: 1703 },
            { file: "7.jpg", order: 7, src: "images/renders/exterior/hospitals/full/7.jpg", thumb: "images/renders/exterior/hospitals/thumb/7.jpg", w: 1868, h: 2075 },
            { file: "8.jpg", order: 8, src: "images/renders/exterior/hospitals/full/8.jpg", thumb: "images/renders/exterior/hospitals/thumb/8.jpg", w: 2560, h: 1920 }
          ] },
        { title: "Office", slug: "office", folder: "Exterior/Office",
          images: [
            { file: "1.jpg", order: 1, src: "images/renders/exterior/office/full/1.jpg", thumb: "images/renders/exterior/office/thumb/1.jpg", w: 1800, h: 2545 },
            { file: "2.jpg", order: 2, src: "images/renders/exterior/office/full/2.jpg", thumb: "images/renders/exterior/office/thumb/2.jpg", w: 1800, h: 2545 },
            { file: "3.jpg", order: 3, src: "images/renders/exterior/office/full/3.jpg", thumb: "images/renders/exterior/office/thumb/3.jpg", w: 1500, h: 1125 },
            { file: "4.jpg", order: 4, src: "images/renders/exterior/office/full/4.jpg", thumb: "images/renders/exterior/office/thumb/4.jpg", w: 1500, h: 1125 },
            { file: "5.png", order: 5, src: "images/renders/exterior/office/full/5.jpg", thumb: "images/renders/exterior/office/thumb/5.jpg", w: 1848, h: 1386 },
            { file: "6.png", order: 6, src: "images/renders/exterior/office/full/6.jpg", thumb: "images/renders/exterior/office/thumb/6.jpg", w: 2024, h: 1518 },
            { file: "7.jpg", order: 7, src: "images/renders/exterior/office/full/7.jpg", thumb: "images/renders/exterior/office/thumb/7.jpg", w: 2560, h: 1442 },
            { file: "8.jpg", order: 8, src: "images/renders/exterior/office/full/8.jpg", thumb: "images/renders/exterior/office/thumb/8.jpg", w: 1600, h: 900 }
          ] },
        { title: "Residential", slug: "residential", folder: "Exterior/Residential",
          images: [
            { file: "1.png", order: 1, src: "images/renders/exterior/residential/full/1.jpg", thumb: "images/renders/exterior/residential/thumb/1.jpg", w: 1564, h: 1006 },
            { file: "2.jpg", order: 2, src: "images/renders/exterior/residential/full/2.jpg", thumb: "images/renders/exterior/residential/thumb/2.jpg", w: 2000, h: 2381 },
            { file: "3.jpg", order: 3, src: "images/renders/exterior/residential/full/3.jpg", thumb: "images/renders/exterior/residential/thumb/3.jpg", w: 1500, h: 1758 },
            { file: "4.jpg", order: 4, src: "images/renders/exterior/residential/full/4.jpg", thumb: "images/renders/exterior/residential/thumb/4.jpg", w: 2560, h: 1440 },
            { file: "5.jpg", order: 5, src: "images/renders/exterior/residential/full/5.jpg", thumb: "images/renders/exterior/residential/thumb/5.jpg", w: 1813, h: 1901 },
            { file: "6.jpg", order: 6, src: "images/renders/exterior/residential/full/6.jpg", thumb: "images/renders/exterior/residential/thumb/6.jpg", w: 2199, h: 2560 },
            { file: "7.jpg", order: 7, src: "images/renders/exterior/residential/full/7.jpg", thumb: "images/renders/exterior/residential/thumb/7.jpg", w: 2254, h: 2560 },
            { file: "8.jpg", order: 8, src: "images/renders/exterior/residential/full/8.jpg", thumb: "images/renders/exterior/residential/thumb/8.jpg", w: 1500, h: 1125 },
            { file: "9.jpg", order: 9, src: "images/renders/exterior/residential/full/9.jpg", thumb: "images/renders/exterior/residential/thumb/9.jpg", w: 2560, h: 2453 },
            { file: "11.jpg", order: 10, src: "images/renders/exterior/residential/full/11.jpg", thumb: "images/renders/exterior/residential/thumb/11.jpg", w: 2000, h: 1500 },
            { file: "12.jpg", order: 11, src: "images/renders/exterior/residential/full/12.jpg", thumb: "images/renders/exterior/residential/thumb/12.jpg", w: 1304, h: 978 },
            { file: "14.jpg", order: 12, src: "images/renders/exterior/residential/full/14.jpg", thumb: "images/renders/exterior/residential/thumb/14.jpg", w: 2560, h: 1920 },
            { file: "15.jpg", order: 13, src: "images/renders/exterior/residential/full/15.jpg", thumb: "images/renders/exterior/residential/thumb/15.jpg", w: 1800, h: 1350 }
          ] },
        { title: "Villa", slug: "villa", folder: "Exterior/Villa",
          images: [
            { file: "1.jpg", order: 1, src: "images/renders/exterior/villa/full/1.jpg", thumb: "images/renders/exterior/villa/thumb/1.jpg", w: 2560, h: 1440 },
            { file: "2.jpg", order: 2, src: "images/renders/exterior/villa/full/2.jpg", thumb: "images/renders/exterior/villa/thumb/2.jpg", w: 2560, h: 1440 },
            { file: "3.jpg", order: 3, src: "images/renders/exterior/villa/full/3.jpg", thumb: "images/renders/exterior/villa/thumb/3.jpg", w: 2408, h: 1806 },
            { file: "4.jpg", order: 4, src: "images/renders/exterior/villa/full/4.jpg", thumb: "images/renders/exterior/villa/thumb/4.jpg", w: 2560, h: 1440 },
            { file: "5.jpg", order: 5, src: "images/renders/exterior/villa/full/5.jpg", thumb: "images/renders/exterior/villa/thumb/5.jpg", w: 2560, h: 1440 },
            { file: "6.jpg", order: 6, src: "images/renders/exterior/villa/full/6.jpg", thumb: "images/renders/exterior/villa/thumb/6.jpg", w: 2200, h: 1238 },
            { file: "7.jpeg", order: 7, src: "images/renders/exterior/villa/full/7.jpg", thumb: "images/renders/exterior/villa/thumb/7.jpg", w: 1920, h: 1080 },
            { file: "8.jpeg", order: 8, src: "images/renders/exterior/villa/full/8.jpg", thumb: "images/renders/exterior/villa/thumb/8.jpg", w: 1920, h: 1080 }
          ] }
      ]
    },

    {
      key: "interior", page: "interior.html", type: "projects",
      title: "Interior", kicker: "Every detail tells a story.",
      blurb: "Capturing the essence of interior spaces through thoughtful lighting, rich materials, and refined details.",
      slide: { src: "images/renders/interior/commercial/full/1.jpg", alt: "Interior render — restaurant dining hall with exposed ceiling grid, pendant lights and brick feature wall", focus: "55% 50%" },
      projects: [
        { title: "Commercial", slug: "commercial", folder: "Interior/Commerial",
          images: [
            { file: "0.jpg", order: 1, src: "images/renders/interior/commercial/full/0.jpg", thumb: "images/renders/interior/commercial/thumb/0.jpg", w: 2560, h: 1440 },
            { file: "1.jpg", order: 2, src: "images/renders/interior/commercial/full/1.jpg", thumb: "images/renders/interior/commercial/thumb/1.jpg", w: 2560, h: 1440 },
            { file: "2.jpg", order: 3, src: "images/renders/interior/commercial/full/2.jpg", thumb: "images/renders/interior/commercial/thumb/2.jpg", w: 2000, h: 2500 },
            { file: "3.jpg", order: 4, src: "images/renders/interior/commercial/full/3.jpg", thumb: "images/renders/interior/commercial/thumb/3.jpg", w: 2000, h: 2500 },
            { file: "4.jpg", order: 5, src: "images/renders/interior/commercial/full/4.jpg", thumb: "images/renders/interior/commercial/thumb/4.jpg", w: 1149, h: 2090 },
            { file: "5.jpg", order: 6, src: "images/renders/interior/commercial/full/5.jpg", thumb: "images/renders/interior/commercial/thumb/5.jpg", w: 1500, h: 1261 },
            { file: "6.jpg", order: 7, src: "images/renders/interior/commercial/full/6.jpg", thumb: "images/renders/interior/commercial/thumb/6.jpg", w: 1500, h: 1327 },
            { file: "7.jpg", order: 8, src: "images/renders/interior/commercial/full/7.jpg", thumb: "images/renders/interior/commercial/thumb/7.jpg", w: 1037, h: 978 },
            { file: "8.jpg", order: 9, src: "images/renders/interior/commercial/full/8.jpg", thumb: "images/renders/interior/commercial/thumb/8.jpg", w: 1500, h: 1103 },
            { file: "9.jpg", order: 10, src: "images/renders/interior/commercial/full/9.jpg", thumb: "images/renders/interior/commercial/thumb/9.jpg", w: 1500, h: 2143 },
            { file: "10.jpg", order: 11, src: "images/renders/interior/commercial/full/10.jpg", thumb: "images/renders/interior/commercial/thumb/10.jpg", w: 1500, h: 2423 },
            { file: "11.jpg", order: 12, src: "images/renders/interior/commercial/full/11.jpg", thumb: "images/renders/interior/commercial/thumb/11.jpg", w: 753, h: 978 }
          ] },
        { title: "Office", slug: "office", folder: "Interior/Office",
          images: [
            { file: "0.jpg", order: 1, src: "images/renders/interior/office/full/0.jpg", thumb: "images/renders/interior/office/thumb/0.jpg", w: 2000, h: 1500 },
            { file: "1.jpg", order: 2, src: "images/renders/interior/office/full/1.jpg", thumb: "images/renders/interior/office/thumb/1.jpg", w: 2000, h: 1500 },
            { file: "2.jpg", order: 3, src: "images/renders/interior/office/full/2.jpg", thumb: "images/renders/interior/office/thumb/2.jpg", w: 2000, h: 1500 },
            { file: "3.jpg", order: 4, src: "images/renders/interior/office/full/3.jpg", thumb: "images/renders/interior/office/thumb/3.jpg", w: 2560, h: 1920 },
            { file: "4.jpg", order: 5, src: "images/renders/interior/office/full/4.jpg", thumb: "images/renders/interior/office/thumb/4.jpg", w: 2560, h: 1920 },
            { file: "5.jpg", order: 6, src: "images/renders/interior/office/full/5.jpg", thumb: "images/renders/interior/office/thumb/5.jpg", w: 1500, h: 1411 },
            { file: "6.jpg", order: 7, src: "images/renders/interior/office/full/6.jpg", thumb: "images/renders/interior/office/thumb/6.jpg", w: 1500, h: 1466 },
            { file: "7.jpg", order: 8, src: "images/renders/interior/office/full/7.jpg", thumb: "images/renders/interior/office/thumb/7.jpg", w: 1500, h: 1466 },
            { file: "8.jpg", order: 9, src: "images/renders/interior/office/full/8.jpg", thumb: "images/renders/interior/office/thumb/8.jpg", w: 1800, h: 1693 },
            { file: "9.jpg", order: 10, src: "images/renders/interior/office/full/9.jpg", thumb: "images/renders/interior/office/thumb/9.jpg", w: 1500, h: 1846 },
            { file: "10.jpg", order: 11, src: "images/renders/interior/office/full/10.jpg", thumb: "images/renders/interior/office/thumb/10.jpg", w: 1500, h: 1256 },
            { file: "11.jpg", order: 12, src: "images/renders/interior/office/full/11.jpg", thumb: "images/renders/interior/office/thumb/11.jpg", w: 1500, h: 1699 }
          ] },
        { title: "Residential", slug: "residential", folder: "Interior/Residential",
          images: [
            { file: "2.png", order: 1, src: "images/renders/interior/residential/full/2.jpg", thumb: "images/renders/interior/residential/thumb/2.jpg", w: 1101, h: 1429 },
            { file: "3.jpg", order: 2, src: "images/renders/interior/residential/full/3.jpg", thumb: "images/renders/interior/residential/thumb/3.jpg", w: 1500, h: 1662 },
            { file: "4.jpg", order: 3, src: "images/renders/interior/residential/full/4.jpg", thumb: "images/renders/interior/residential/thumb/4.jpg", w: 1500, h: 1643 },
            { file: "5.jpg", order: 4, src: "images/renders/interior/residential/full/5.jpg", thumb: "images/renders/interior/residential/thumb/5.jpg", w: 1980, h: 2560 },
            { file: "6.jpg", order: 5, src: "images/renders/interior/residential/full/6.jpg", thumb: "images/renders/interior/residential/thumb/6.jpg", w: 1801, h: 2560 },
            { file: "7.png", order: 6, src: "images/renders/interior/residential/full/7.jpg", thumb: "images/renders/interior/residential/thumb/7.jpg", w: 2000, h: 1500 },
            { file: "8.png", order: 7, src: "images/renders/interior/residential/full/8.jpg", thumb: "images/renders/interior/residential/thumb/8.jpg", w: 2000, h: 1500 },
            { file: "9.jpg", order: 8, src: "images/renders/interior/residential/full/9.jpg", thumb: "images/renders/interior/residential/thumb/9.jpg", w: 2057, h: 2560 },
            { file: "10.jpg", order: 9, src: "images/renders/interior/residential/full/10.jpg", thumb: "images/renders/interior/residential/thumb/10.jpg", w: 2057, h: 2560 },
            { file: "11.jpg", order: 10, src: "images/renders/interior/residential/full/11.jpg", thumb: "images/renders/interior/residential/thumb/11.jpg", w: 2057, h: 2560 },
            { file: "12.png", order: 11, src: "images/renders/interior/residential/full/12.jpg", thumb: "images/renders/interior/residential/thumb/12.jpg", w: 1221, h: 1288 },
            { file: "13.png", order: 12, src: "images/renders/interior/residential/full/13.jpg", thumb: "images/renders/interior/residential/thumb/13.jpg", w: 1600, h: 1200 },
            { file: "14.jpg", order: 13, src: "images/renders/interior/residential/full/14.jpg", thumb: "images/renders/interior/residential/thumb/14.jpg", w: 2408, h: 1806 },
            { file: "15.jpg", order: 14, src: "images/renders/interior/residential/full/15.jpg", thumb: "images/renders/interior/residential/thumb/15.jpg", w: 1698, h: 2560 },
            { file: "16.jpg", order: 15, src: "images/renders/interior/residential/full/16.jpg", thumb: "images/renders/interior/residential/thumb/16.jpg", w: 2260, h: 2560 },
            { file: "17.jpg", order: 16, src: "images/renders/interior/residential/full/17.jpg", thumb: "images/renders/interior/residential/thumb/17.jpg", w: 1996, h: 2287 },
            { file: "18.jpg", order: 17, src: "images/renders/interior/residential/full/18.jpg", thumb: "images/renders/interior/residential/thumb/18.jpg", w: 1800, h: 1603 },
            { file: "19.jpg", order: 18, src: "images/renders/interior/residential/full/19.jpg", thumb: "images/renders/interior/residential/thumb/19.jpg", w: 1793, h: 2205 },
            { file: "21.jpg", order: 19, src: "images/renders/interior/residential/full/21.jpg", thumb: "images/renders/interior/residential/thumb/21.jpg", w: 1500, h: 1631 },
            { file: "22.jpg", order: 20, src: "images/renders/interior/residential/full/22.jpg", thumb: "images/renders/interior/residential/thumb/22.jpg", w: 1800, h: 1794 },
            { file: "23.jpg", order: 21, src: "images/renders/interior/residential/full/23.jpg", thumb: "images/renders/interior/residential/thumb/23.jpg", w: 2560, h: 2060 },
            { file: "24.jpg", order: 22, src: "images/renders/interior/residential/full/24.jpg", thumb: "images/renders/interior/residential/thumb/24.jpg", w: 2133, h: 2560 },
            { file: "25.jpg", order: 23, src: "images/renders/interior/residential/full/25.jpg", thumb: "images/renders/interior/residential/thumb/25.jpg", w: 1500, h: 1875 },
            { file: "26.jpg", order: 24, src: "images/renders/interior/residential/full/26.jpg", thumb: "images/renders/interior/residential/thumb/26.jpg", w: 1500, h: 1500 },
            { file: "27.jpg", order: 25, src: "images/renders/interior/residential/full/27.jpg", thumb: "images/renders/interior/residential/thumb/27.jpg", w: 2001, h: 2014 }
          ] }
      ]
    },

    {
      key: "panoramas", page: "panoramas.html", type: "projects", pano: true,
      title: "360° Views", kicker: "Beyond the frame, into the space.",
      blurb: "Creating immersive 360° experiences that let you explore architectural spaces from every perspective.",
      slide: { src: "images/panoramas/hero-360.jpg", alt: "360° render — lakeside lounge deck with shade canopy at golden hour", focus: "50% 55%" },
      /* PANORAMAS — one project per subcategory, like Exterior / Interior.
         src = 2:1 equirectangular (6144x3072) for the 360° viewer
         mobile = 4096x2048 copy, used where the device's GPU can't take 6144
         thumb = flat camera view rendered from the panorama (1600x900) */
      projects: [
        { title: "Landscape", slug: "landscape", folder: "360",
          description: "Lagoon boardwalks, lounge decks and garden walks — outdoor amenity panoramas.",
          images: [
            { file: "1.jpg", order: 1, title: "Lagoon Boardwalk", src: "images/panoramas/landscape/full/1.jpg", mobile: "images/panoramas/landscape/mobile/1.jpg", thumb: "images/panoramas/landscape/thumb/1.jpg", w: 1600, h: 900 },
            { file: "2.jpg", order: 2, title: "Lounge Deck", src: "images/panoramas/landscape/full/2.jpg", mobile: "images/panoramas/landscape/mobile/2.jpg", thumb: "images/panoramas/landscape/thumb/2.jpg", w: 1600, h: 900 },
            { file: "3.jpg", order: 3, title: "Garden Promenade", src: "images/panoramas/landscape/full/3.jpg", mobile: "images/panoramas/landscape/mobile/3.jpg", thumb: "images/panoramas/landscape/thumb/3.jpg", w: 1600, h: 900 },
            { file: "4.jpg", order: 4, title: "Waterside Walk", src: "images/panoramas/landscape/full/4.jpg", mobile: "images/panoramas/landscape/mobile/4.jpg", thumb: "images/panoramas/landscape/thumb/4.jpg", w: 1600, h: 900 },
            { file: "5.jpg", order: 5, title: "Tropical Garden Path", src: "images/panoramas/landscape/full/5.jpg", mobile: "images/panoramas/landscape/mobile/5.jpg", thumb: "images/panoramas/landscape/thumb/5.jpg", w: 1600, h: 900 }
          ] },
        { title: "Interiors", slug: "interiors", folder: "360",
          description: "Living, dining, bedroom and kitchen — full-room interior panoramas.",
          images: [
            { file: "6.jpg", order: 1, title: "Living Room", src: "images/panoramas/interior/full/6.jpg", mobile: "images/panoramas/interior/mobile/6.jpg", thumb: "images/panoramas/interior/thumb/6.jpg", w: 1600, h: 900 },
            { file: "7.jpg", order: 2, title: "Living & Dining", src: "images/panoramas/interior/full/7.jpg", mobile: "images/panoramas/interior/mobile/7.jpg", thumb: "images/panoramas/interior/thumb/7.jpg", w: 1600, h: 900 },
            { file: "8.jpg", order: 3, title: "Master Bedroom", src: "images/panoramas/interior/full/8.jpg", mobile: "images/panoramas/interior/mobile/8.jpg", thumb: "images/panoramas/interior/thumb/8.jpg", w: 1600, h: 900 },
            { file: "9.jpg", order: 4, title: "Kitchen", src: "images/panoramas/interior/full/9.jpg", mobile: "images/panoramas/interior/mobile/9.jpg", thumb: "images/panoramas/interior/thumb/9.jpg", w: 1600, h: 900 }
          ] }
      ]
    }
  ]
};
