export default function Progress(props) {
  return (
    <>
      {props.uploading ? (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 max-w-sm w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <ion-icon
                  name="cloud-upload"
                  className="text-white text-2xl"
                ></ion-icon>
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Uploading File
              </h3>
              <p className="text-white/70 text-sm">
                Please wait while your file is being uploaded...
              </p>
            </div>

            <div className="w-full bg-white/20 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out shadow-lg"
                style={{ width: `${props.uploading}%` }}
              ></div>
            </div>

            <div className="text-center">
              <span className="text-white font-semibold text-lg">
                {Math.ceil(props.uploading)}%
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
