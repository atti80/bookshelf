const ReadMore = () => {
  return (
    <div className="flex items-center gap-2">
      <span id="readmore-text" className="text-primary-dark">
        Read more
      </span>
      <div id="arrows" className="flex items-center w-16 gap-2 ">
        <div className="w-0 h-0 border-l-16 border-t-8 border-b-8 border-r-0 border-l-primary-dark border-t-transparent border-b-transparent readmore-arrow opacity-0"></div>
        <div className="w-0 h-0 border-l-16 border-t-8 border-b-8 border-r-0 border-l-primary border-t-transparent border-b-transparent readmore-arrow opacity-0"></div>
        <div className="w-0 h-0 border-l-16 border-t-8 border-b-8 border-r-0 border-l-primary-light border-t-transparent border-b-transparent readmore-arrow opacity-0"></div>
      </div>
    </div>
  );
};

export default ReadMore;
