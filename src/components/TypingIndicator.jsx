import "../styles/typing.scss";

export default function TypingIndicator() {
  return (
    <div class="ticontainer absolute -top-3.5 -left-2">
      <div class="tiblock">
        <div class="tidot"></div>
        <div class="tidot"></div>
        <div class="tidot"></div>
      </div>
    </div>
  );
}
