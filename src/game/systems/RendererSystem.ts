import { System, Entity } from "ecsy";
import { Renderable, Size, CanvasContext, Radius } from "../components";

export class RendererSystem extends System {
  static queries = {
    context: { components: [CanvasContext] },
    renderables: { components: [Renderable] },
  };

  execute(delta: number, time: number): void {
    const context = this.queries.context.results[0];
    const {
      ctx,
      width: canvasWidth,
      height: canvasHeight,
    } = context.getComponent<CanvasContext>(CanvasContext);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    this.queries.renderables.results.forEach((entity) => {
      const { primitive, isEnabled } = entity.getComponent<Renderable>(
        Renderable
      );

      // If not enabled, skip render
      if (!isEnabled) return;

      const renderFunctions = {
        rect: this.renderRect,
        circle: this.renderCircle,
      };

      if (renderFunctions[primitive]) {
        renderFunctions[primitive](ctx, entity);
      } else {
        console.log(
          `${primitive} primitive does not implement a render function`
        );
      }
    });
  }

  renderRect(ctx: CanvasRenderingContext2D, entity: Entity): void {
    const { position } = entity.getComponent<Renderable>(Renderable);
    const { value: size } = entity.getComponent<Size>(Size);
    ctx.beginPath();
    ctx.rect(position.x, position.y, size.x, size.y);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  renderCircle(ctx: CanvasRenderingContext2D, entity: Entity): void {
    const { position } = entity.getComponent<Renderable>(Renderable);
    const { value: radius } = entity.getComponent<Radius>(Radius);
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}
