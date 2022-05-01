import "../styles/typing.scss";

export default function TypingIndicator() {
  return (
    <div class="ticontainer absolute -top-10 -left-1">
      <div class="tiblock">
        <div class="tidot"></div>
        <div class="tidot"></div>
        <div class="tidot"></div>
      </div>
    </div>
  );
}
