import "../styles/typing.scss";

export default function TypingIndicator() {
  return (
    <div className="ticontainer absolute -top-3.5 -left-2">
      <div className="tiblock">
        <div className="tidot"></div>
        <div className="tidot"></div>
        <div className="tidot"></div>
      </div>
    </div>
  );
}
