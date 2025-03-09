/****************************************************
 * GridLayout Class
 * --------------------------------------------------
 * Manages the grid layout for displaying images.
 * 
 * `Constructor`:
 * Initializes the grid layout with the following parameters:
 * - baseX and baseY: Define the starting coordinates (top-left corner) of the grid.
 * - cellWidth and cellHeight: Specify the dimensions of each cell within the grid.
 * - paddingX and paddingY: Determine the horizontal and vertical spacing between cells.
 * 
 * This setup allows for precise control over the positioning and spacing of images within the grid.
 * 
 * `getPosition` Method:
 * Calculates the position of a specific cell based on its column (col) and row (row) indices.
 * - The x-coordinate is calculated as: x = baseX + col × (cellWidth + paddingX)
 * - The y-coordinate is calculated as: y = baseY + row × (cellHeight + paddingY)
 * 
 * This calculation ensures that each image is placed correctly within the grid, respecting the defined cell size and padding.
 * 
 * Source:
 * 
 * This implementation is inspired by the grid template with coordinate display by kchung:
 * https://editor.p5js.org/kchung/sketches/rkp-wOIF7
 ****************************************************/
class GridLayout {
    /**
     * Constructor for GridLayout.
     * @param {number} baseX - Starting X coordinate.
     * @param {number} baseY - Starting Y coordinate.
     * @param {number} cellWidth - Width of each cell.
     * @param {number} cellHeight - Height of each cell.
     * @param {number} paddingX - Horizontal padding between cells.
     * @param {number} paddingY - Vertical padding between cells.
     */
    constructor(baseX, baseY, cellWidth, cellHeight, paddingX, paddingY) {
      this.baseX = baseX;
      this.baseY = baseY;
      this.cellWidth = cellWidth;
      this.cellHeight = cellHeight;
      this.paddingX = paddingX;
      this.paddingY = paddingY;
    }
    
    /**
     * Calculates the position for a given cell.
     * @param {number} col - Column index.
     * @param {number} row - Row index.
     * @returns {object} An object with x and y coordinates.
     */
    getPosition(col, row) {
      const x = this.baseX + col * (this.cellWidth + this.paddingX);
      const y = this.baseY + row * (this.cellHeight + this.paddingY);
      return { x, y };
    }
  }