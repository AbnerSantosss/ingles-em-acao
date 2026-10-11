# Hero e conversa com IA — prompts de imagens

Modo utilizado: ferramenta built-in ImageGen. Data: 10/10/2026.

## Hero desktop sem globo

- Origem editada: `public/brand/hero-desktop.webp`.
- Saída: `public/brand/hero-desktop-sem-globo.webp` (1672 × 941, WebP quality 90).
- PNG original gerado: `C:/Users/User/.codex/generated_images/01a127ba-8f4d-7192-ae36-f0b29cb811c1/exec-279e5763-10db-454b-a7dc-668c193e04be.png`.
- Inspeção: globo removido; preservados a paleta navy/dourado, Big Ben e Westminster, ondas azuis, diagonal escura e estrelas.

### Prompt final

```text
Use case: precise-object-edit
Asset type: existing desktop website hero background, wide landscape 16:9.
Input images: Image 1 is the edit target. Preserve its existing scene and composition.
Primary request: remove only the enormous navy-and-gold Earth globe in the upper right of this image, including its gold rim and continents. Fill the removed globe space seamlessly with the same quiet navy blue nighttime cosmic/atmospheric background surrounding it.
Invariants: keep all remaining image details unchanged: dark navy palette and lighting, the Big Ben / Palace of Westminster skyline at bottom right, gold small stars and gentle dust, dark diagonal abstract band through center-top, blue wave shapes along the bottom edge, and subtle gold orbit line around the left part of the canvas. Retain the exact original wide framing and composition. Do not add a globe, planet, additional building, text, logo, person, or object.
The user will overlay an animated code-rendered globe over the upper-right empty space later; therefore there must be no static globe or curved bright gold globe outline left there.
Style: identical high-quality atmospheric brand artwork, clean navy/gold background, seamless precise object removal.
```

## Foto de prática no campus

- Saída: `public/brand/conversa-ia-campus.webp` (1600 × 900, WebP quality 89).
- PNG original gerado: `C:/Users/User/.codex/generated_images/01a127ba-8f4d-7192-ae36-f0b29cb811c1/exec-c97f0ef2-1c4e-4ac3-8308-fdf6158f1d42.png`.
- Inspeção: jovem adulta negra inteira, sentada à direita, escorada na parede, pés no banco, headphones brancos e smartphone; luz natural e pátio livre à esquerda. Degradê e tratamento roxo ficam a cargo de CSS.

### Prompt final

```text
Use case: photorealistic-natural
Asset type: wide landscape 16:9 background photograph for an English-learning website conversation-practice section.
Primary request: an adult young Black university student, approximately 23 years old, studying English using her smartphone while seated comfortably on a bench in a university courtyard. She is leaning her back against an architectural wall on the RIGHT side of the image, with her legs stretched out and feet resting on the bench. She wears WHITE over-ear headphones.
Composition/framing: natural broad side view with the woman's entire body visible, from head to feet. Place the woman, wall and bench on the RIGHT HALF of the photograph, especially the right third. The LEFT HALF should be quiet unobstructed courtyard negative space with simple architecture for overlaying website text; the left will later be faded to zero opacity by CSS. No other people.
Scene/backdrop: believable university patio/courtyard, stone or concrete bench against a warm light architectural wall, subtle greenery in the distance, a calm campus atmosphere.
Subject details: real natural dark skin texture, relaxed attentive expression, believable proportions and posture, casual university clothes, unbranded smartphone in hands, realistic white headphones.
Lighting/mood: soft natural daylight, candid editorial lifestyle photograph, detailed but not overly sharpened, authentic non-plastic skin.
Color palette: natural subdued campus tones, warm gray stone and gentle greens, suitable for integration with a dark purple website.
Constraints: no purple gradient inside the photograph; no text, readable text on phone, logo or watermark; no additional characters; no collage; no artificial beauty retouching or 3D rendering; retain wide horizontal framing and uncluttered left half.
```
