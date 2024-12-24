'use client';

import Image from 'next/image';
import '@/styles/pages/main.scss';

export default function Home() {
  return (
    <div>
      <section className='sec01'>
        <div className="video_cont">
          <video src="/videos/main_vid3.mp4" autoPlay loop muted playsInline className='main_video'></video>
          
          <div className="txt_box">
            <h2 className='title'>MadiMap+</h2>
            <p className='sub_title'>우리 동네 약국도, 긴급한 약물도 한곳에서</p>
            <input type="text" placeholder='찾아보고 싶은 약물이름을 검색해주세요. 예) 게보린 💊' />
          </div>
        </div>
      </section>
      <section className="sec02">
        <div className="inner">
          <h2 className='title'>Overview</h2>
          <div className="top_cont">
          <h3 className='sub_title'>약물과 약국 정보를 쉽고 빠르게!</h3>
          <p className='desc_txt'>
            건강을 지키기 위해서는 정확한 약물 정보와 접근 가능한 약국 위치가 중요합니다.<br />
            MediMap은 사용자가 손쉽게 약물을 검색하고, 주변 약국 위치를 한눈에 확인할 수 있도록 도와줍니다.
          </p>
          </div>
          <div className="bottom_cont">
            <div className="item">
              <h3>정확하고 신속한 <span>약물 정보 검색</span></h3>
              <Image src="/images/main-icon1.png" alt="" width={300} height={300} />
            </div>
            <div className="item">
            <h3>편리한 <span>약국 위치 검색</span></h3>
            <Image src="/images/main-icon2.png" alt="" width={300} height={300} />
            </div>
          </div>
        </div>
      </section>
      <section className="sec03">
        <div className="inner">
          <h2 className="title">Persona</h2>
          <h3 className='sub_title'>유저들은 어떻게 생각할까요?</h3>
          <p className='desc_txt'>
            MediMap은 실제 사용자들의 상황을 바탕으로 설계되었습니다.<br />
            건강 관리와 관련된 다양한 고민을 해결하는 데 초점을 맞추고 있습니다.
          </p>

          <div className="banner">
            <div className="top_cont">
              <div className="item">
              <Image src="/images/memoji01.png" alt="" width={200} height={200} />
                <div className="txt_cont">
                  <span className="name">김서연 (29세)</span>
                  <p className="txt">필요한 약물 정보를 빠르게 확인하고 싶어요.</p>
                  <p className="txt_desc">
                    내가 복용해야 하는 약이 안전한지, 성분과 부작용을 정확하게 알고 싶어요.
                  </p>
                  <p className="txt_desc">
                    복잡한 정보 말고 딱 필요한 핵심 정보만 알려주면 좋겠어요.
                  </p>
                </div>
              </div>

              <div className="item">
              <Image src="/images/memoji02.png" alt="" width={200} height={200} />
                <div className="txt_cont">
                  <span className="name">이진우 (33세)</span>
                  <p className="txt">지금 영업 중인 약국을 바로 찾아갈 수 있었으면 해요.</p>
                  <p className="txt_desc">늦은 밤에 약이 필요할 때 어디가 열었는지 모르겠어요.</p>
                  <p className="txt_desc">
                    현재 위치에서 가장 가까운 약국을 빠르게 찾아갈 수 있으면 좋겠어요.
                  </p>
                </div>
              </div>
            </div>

            <div className="bottom_cont">
              <div className="item">
              <Image src="/images/memoji03.png" alt="" width={200} height={200} />
                <div className="txt_cont">
                  <span className="name">박민정 (31세)</span>
                  <p className="txt">다른 사람들의 건강 경험을 참고하고 싶어요.</p>
                  <p className="txt_desc">같은 증상이나 약을 사용한 사람들이 남긴 후기를 보고 싶어요.</p>
                  <p className="txt_desc">건강 정보나 의견을 나눌 수 있는 게시판이 있으면 좋겠어요.</p>
                </div>
              </div>

              <div className="item">
              <Image src="/images/memoji04.png" alt="" width={200} height={200} />
                <div className="txt_cont">
                  <span className="name">한지수 (25세)</span>
                  <p className="txt">즐겨찾기한 약물을 빠르게 확인하고 싶어요.</p>
                  <p className="txt_desc">
                    건강 관리도 꾸준히 해야 하니까 내가 매번 복용하는 약물 목록을 저장해두고 확인하고 싶어요.
                  </p>
                  <p className="txt_desc">필요할 때마다 약물 정보를 다시 찾는 번거로움을 줄이고 싶어요.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}