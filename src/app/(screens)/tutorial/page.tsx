"use client";
import Image from "next/image";
import Link from "next/link";

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-gray-900 pt-16 text-gray-100">
      {/* Back button */}
      <Link
        href="/game"
        className="fixed left-4 top-4 rounded-full bg-gray-800 p-3 text-white shadow-md transition-colors hover:bg-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </Link>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-white">開場白</h2>
          <p className="mb-4 leading-relaxed text-gray-300">
            歡迎來到大地遊戲—逃逸路線。
          </p>
          <p className="mb-4 leading-relaxed text-gray-300">
            身處於現今紛紛擾擾的世代中，或許時常感到迷惘，但這無法抹滅藏於心中的熱血。
          </p>
          <p className="mb-4 leading-relaxed text-gray-300">
            覺察、並聆聽自我，會發現「路徑」潛在無數可能。
          </p>
          <p className="leading-relaxed text-gray-300">
            就在這充滿障礙的地圖中找到專屬自己的道路吧！
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-white">基本規則</h2>
          <p className="mb-4 leading-relaxed text-gray-300">
            遊戲中，可把手中的板塊放入地圖，將起點與終點連接即為通關。
          </p>
          <p className="mb-4 leading-relaxed text-gray-300">
            如果手中板塊不足以連接，就去攤位逛逛吧！交流完畢後，你將能補充隨機一種板塊。
          </p>
          <p className="leading-relaxed text-gray-300">
            每通過一關能獲得{" "}
            <span className="font-bold text-yellow-400">點數</span>
            ，點數可以到 <span className="font-bold text-yellow-400">
              商店
            </span>{" "}
            兌換抽獎券並進行抽獎。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-white">
            失去板塊規則（第一次通關後觸發）
          </h2>
          <p className="mb-4 leading-relaxed text-gray-300">
            有得，必有失。
            <br />
            在突破框架、掙脫束縛時，
            <br />
            會發現，擁抱自由意味著必須捨棄些什麼。
            <br />
            也許，要忽視他人的眼光；
            <br />
            也許，會喪失原先安逸的道路。
            <br />
            因此，少一兩個板塊肯定也是合情合理的啦:D
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-white">計畫共享板塊</h2>
          <p className="mb-4 leading-relaxed text-gray-300">
            除了跟在社會上歷練拓展道路方向（跟攤位互動拿板塊）
            <br />
            跟一群志同道合的夥伴一同奮鬥，或許也會有收穫！
            <br />
            如果你有參與指南針計畫，只要你的夥伴獲得板塊，你也能獲得！
            <br />
            （玩家連結板塊不算，請自行去社交ouob）
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-white">玩家連結板塊</h2>
          <p className="mb-4 leading-relaxed text-gray-300">
            除了跟在社會上歷練拓展道路方向（跟攤位互動拿板塊）
            <br />
            跟同儕交流分享，或許能激發全新的想法！
            <br />
            選擇 1～3 塊板塊，跟其他會眾互掃 QR code 將能取得彼此選擇的板塊！
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-white">商店</h2>
          <p className="mb-4 leading-relaxed text-gray-300">
            歡迎來到商店，
            <br />每 <span className="font-bold text-yellow-400">
              點數
            </span>{" "}
            點數能兌換一張抽獎券。
            <br />
            將抽獎券投注在自己喜歡的獎品上吧！
            <br />
            當然，投愈多，中獎機會愈大！
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-white">排行榜</h2>
          <p className="mb-4 leading-relaxed text-gray-300">
            歡迎來到排行榜，這裡是與他人一較高下的地方。
            <br />
            這邊將記錄累積的最高點數（兌換抽獎券不影響）
            <br />
            去榜首告訴大家你的生命多麼奔放吧( •̀ ω •́ )✧
          </p>
        </section>
      </div>
    </div>
  );
}
