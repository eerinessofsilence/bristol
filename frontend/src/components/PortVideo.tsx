export function PortVideo() {
  return (
    <section className="py-20 md:py-24">
      <div className="page-wrap">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <span className="section-tag">Наживо</span>
          <h2 className="section-title mt-4">Як виглядає оформлення в порту</h2>
          <p className="text-portway-ink-3 mt-4">
            Розвантаження, огляд контейнерів і робота терміналу — коротке відео з порту.
          </p>
        </div>
        <div className="relative mt-10 overflow-hidden rounded-[18px] bg-black" data-reveal>
          <video
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            preload="auto"
            className="pointer-events-none aspect-video w-full object-cover"
          >
            <source
              src="https://cdn.pixabay.com/video/2024/06/13/216619_large.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </section>
  );
}
