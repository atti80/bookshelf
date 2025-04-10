import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Link from "next/link";

const ReadMore = ({ id }: { id: number }) => {
  const container = useRef<HTMLElement | any>(null);
  const tl = useRef<GSAPTimeline | any>(gsap.timeline());
  const hoverAnimation = () => {
    tl.current.reversed(false);
  };

  const reverseHoverAnimation = () => {
    tl.current.reversed(true);
  };

  useGSAP(
    () => {
      const arrows = gsap.utils.toArray<HTMLElement>(".readmore-arrow");
      var docStyle = getComputedStyle(container.current);
      const primaryDark = docStyle.getPropertyValue("--color-primary-dark");
      const primary = docStyle.getPropertyValue("--color-primary");
      const primaryLight = docStyle.getPropertyValue("--color-primary-light");

      tl.current = gsap
        .timeline()
        .to("#readmore-text", {
          color: primaryLight,
          duration: 0.05,
        })
        .to(arrows[0], {
          opacity: 1,
          duration: 0.05,
        })
        .to(arrows[1], {
          opacity: 1,
          duration: 0.05,
        })
        .to(arrows[2], {
          opacity: 1,
          duration: 0.05,
        })
        .reverse();
    },
    { scope: container }
  );

  return (
    <div className="flex items-center gap-2" ref={container}>
      <Link href={`/article/${id}`}>
        <span
          id="readmore-text"
          className="text-primary-dark"
          onMouseEnter={hoverAnimation}
          onMouseLeave={reverseHoverAnimation}
        >
          Read more
        </span>
      </Link>
      <div id="arrows" className="flex items-center w-16 gap-2 ">
        <div className="w-0 h-0 border-l-16 border-t-8 border-b-8 border-r-0 border-l-primary-dark border-t-transparent border-b-transparent readmore-arrow opacity-0"></div>
        <div className="w-0 h-0 border-l-16 border-t-8 border-b-8 border-r-0 border-l-primary border-t-transparent border-b-transparent readmore-arrow opacity-0"></div>
        <div className="w-0 h-0 border-l-16 border-t-8 border-b-8 border-r-0 border-l-primary-light border-t-transparent border-b-transparent readmore-arrow opacity-0"></div>
      </div>
    </div>
  );
};

export default ReadMore;
