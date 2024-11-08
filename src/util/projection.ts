export class Projection {
  canvasWidth: number
  canvasHeight: number
  offsetX: number = 0
  offsetY: number = 0
  scale: number = 0.1
  constructor(width: number, height: number) {
    this.canvasWidth = width
    this.canvasHeight = height
  }
  project(longLang: [number, number]) {
    // Define Ethiopia's approximate geographic bounds
    const minLng = 33;
    const maxLng = 48;
    const minLat = 3;
    const maxLat = 15;

    // Calculate the center coordinates of Ethiopia
    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;

    const longitude = longLang[0];
    const latitude = longLang[1];

    // Define map dimensions in degrees
    const mapWidth = maxLng - minLng;
    const mapHeight = maxLat - minLat;

    // Calculate scale factor to fit the map within the canvas while preserving aspect ratio
    const scale = 0.8 * Math.min(this.canvasWidth / mapWidth, this.canvasHeight / mapHeight);

    // Calculate x and y positions using the inverted scale, centering, and offset
    const x = ((longitude - centerLng) * scale) + this.offsetX;
    const y = ((centerLat - latitude) * scale) + this.offsetY;

    return { x, y };
  }

  resize(width: number, height: number) {
    this.canvasHeight = height
    this.canvasWidth = width
  }

}
