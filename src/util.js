export const getDataURLFromRGB = (rgb) => {
  const canvas = document.createElement('canvas')
  canvas.width = 96
  canvas.height = 96

  const ctx = canvas.getContext('2d')
  const imageData = ctx.createImageData(96, 96)
  const data = imageData.data

  for (let i = 0, t = 0; i < data.length; i += 4) {
    data[i] = rgb[t+2]
    data[i+1] = rgb[t+1]
    data[i+2] = rgb[t]
    data[i+3] = 255
  }

  ctx.putImageData(imageData, 0, 0)

  return canvas.toDataURL('image/png')
}

