"use client";
import Image from "next/image";
import Link from "next/link";

export default function TutorialPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Back button */}
            <Link
                href="/game"
                className="fixed left-4 top-4 rounded-full bg-gray-800 p-3 text-white hover:bg-gray-700 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
                        ，點數可以到{" "}
                        <span className="font-bold text-yellow-400">商店</span>{" "}
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
                        <br />
                        每 <span className="font-bold text-yellow-400">點數</span>{" "}
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

                <section className="mb-12">
                    <h1 className="mb-8 text-3xl font-bold text-white">SITCON 2025 大地遊戲 1~11 關卡設計</h1>

                    <div className="mb-8 rounded-lg bg-gray-800 p-4">
                        <p className="mb-4 text-green-400">綠色格子：起始板塊</p>
                        <p className="mb-4 text-red-400">紅色格子：終點板塊</p>
                        <p className="mb-4 text-gray-400">灰色格子：障礙物</p>
                        <p className="mb-4 text-white">實線板塊：起始附贈板塊</p>
                        <p className="mb-4 text-white/60">虛線板塊：預定獲得板塊</p>
                        <p className="mb-4 text-pink-400">粉紅框線：板塊放置提示格</p>
                        <p className="text-blue-400">藍色框線：道具使用提示格</p>
                    </div>

                    <div className="space-y-12">
                        {/* Stage 1 */}
                        <div className="rounded-lg bg-gray-800 p-6">
                            <h3 className="mb-4 text-xl font-bold text-white">Stage 1</h3>
                            <div className="mb-6">
                                <Image
                                    src="https://hackmd.io/_uploads/BJnzJnKKyx.png"
                                    alt="Stage 1"
                                    width={500}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[開場白]</h4>
                                    <p className="text-gray-300">歡迎來到大地遊戲-逃逸路線，在種種複雜的地圖中找到專屬自己的道路吧！</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡一提示一]</h4>
                                    <p className="text-gray-300">每個地圖上會有一個起點，一個終點，試圖用手中的板塊，將起點與終點連接即可通關。首先，先讓我們來嘗試放置板塊吧。</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡一提示二]</h4>
                                    <p className="text-gray-300">若板塊不夠，可以透過與攤位互動取得。</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡一提示三]</h4>
                                    <p className="text-gray-300">除了跟攤位戶動之外，計畫共享、玩家連結以及成就解鎖也能取得新的板塊。計畫共享：跟指南針計畫的夥伴分享板塊。玩家連結：跟其他玩家互掃ＱＲcode獲得板塊。成就解鎖：完成特定任務，獲得板塊。</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡一提示四]</h4>
                                    <p className="text-gray-300">事不遲疑，將起點與終點連接吧！</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡一提示五]</h4>
                                    <p className="text-gray-300">完成關卡後，就能賺取點數。點數可以換取道具、抽獎券、折抵券，因此，好好蒐集點數吧！</p>
                                </div>
                            </div>
                        </div>

                        {/* Stage 2 */}
                        <div className="rounded-lg bg-gray-800 p-6">
                            <h3 className="mb-4 text-xl font-bold text-white">Stage 2</h3>
                            <div className="mb-6">
                                <Image
                                    src="https://hackmd.io/_uploads/B1cUF2KFkl.png"
                                    alt="Stage 2"
                                    width={500}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡二提示一]</h4>
                                    <p className="text-gray-300">每通過一個關卡，就會隨機收回 1~2 片板塊。為此，嘗試多收集各式各樣的板塊吧。</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡二提示二]</h4>
                                    <p className="text-gray-300">板塊只能接在已放置板塊(包含起點)的周圍八格，並且道路只能連接道路。</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡二提示三]</h4>
                                    <p className="text-gray-300">明明是一步之遙，卻無法抵達...。</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡二提示四]</h4>
                                    <p className="text-gray-300">這時，若妥善使用道具，就能化解如此窘境。試試看使用旋轉板塊道具吧。</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡二提示五]</h4>
                                    <p className="text-gray-300">想獲得道具，可透過ＯＯＯ的方式取得。另外，道具與板塊不同，用完無法回收，務必挑選在正確的時機點使用！</p>
                                </div>
                            </div>
                        </div>

                        {/* Stage 3 */}
                        <div className="rounded-lg bg-gray-800 p-6">
                            <h3 className="mb-4 text-xl font-bold text-white">Stage 3</h3>
                            <div className="mb-6">
                                <Image
                                    src="https://hackmd.io/_uploads/HJ7ecatFkg.png"
                                    alt="Stage 3"
                                    width={500}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡三提示一]</h4>
                                    <p className="text-gray-300">哇！起點被障礙物包起來了！</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡三提示二]</h4>
                                    <p className="text-gray-300">只要使用炸彈，就能將障礙物炸開！</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡三提示三]</h4>
                                    <p className="text-gray-300">藝術就是爆炸！朝著終點方向前進吧！</p>
                                </div>
                            </div>
                        </div>

                        {/* Stage 4 */}
                        <div className="rounded-lg bg-gray-800 p-6">
                            <h3 className="mb-4 text-xl font-bold text-white">Stage 4</h3>
                            <div className="mb-6">
                                <Image
                                    src="https://hackmd.io/_uploads/HJRU2aFtJx.png"
                                    alt="Stage 4"
                                    width={500}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡四提示一]</h4>
                                    <p className="text-gray-300">這堵厚牆似乎不是炸彈可以處理的...</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡四提示二]</h4>
                                    <p className="text-gray-300">使用傳送門，跨越眼前這個障礙吧。首先，先放一個直線板塊。</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡四提示三]</h4>
                                    <p className="text-gray-300">對此板塊使用傳送門</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡四提示四]</h4>
                                    <p className="text-gray-300">點擊想傳送到的位置</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <h4 className="mb-2 font-bold text-purple-300">[關卡四提示五]</h4>
                                    <p className="text-gray-300">除了閃避障礙物，也能幫忙省略不必要的遠路！就這樣直奔終點吧。</p>
                                </div>
                            </div>
                        </div>

                        {/* Stage 5 */}
                        <div className="rounded-lg bg-gray-800 p-6">
                            <h3 className="mb-4 text-xl font-bold text-white">Stage 5</h3>
                            <div className="mb-6">
                                <Image
                                    src="https://hackmd.io/_uploads/rJ1UdAKYkg.png"
                                    alt="Stage 5"
                                    width={500}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Stage 6 */}
                        <div className="rounded-lg bg-gray-800 p-6">
                            <h3 className="mb-4 text-xl font-bold text-white">Stage 6</h3>
                            <div className="mb-6">
                                <Image
                                    src="https://hackmd.io/_uploads/B1v-dAYFyg.png"
                                    alt="Stage 6"
                                    width={500}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Stage 7 */}
                        <div className="rounded-lg bg-gray-800 p-6">
                            <h3 className="mb-4 text-xl font-bold text-white">Stage 7</h3>
                            <div className="mb-6">
                                <Image
                                    src="https://hackmd.io/_uploads/S168_CFFJl.png"
                                    alt="Stage 7"
                                    width={500}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Stage 8 */}
                        <div className="rounded-lg bg-gray-800 p-6">
                            <h3 className="mb-4 text-xl font-bold text-white">Stage 8</h3>
                            <div className="mb-6">
                                <Image
                                    src="https://hackmd.io/_uploads/ByG9OAtFyx.png"
                                    alt="Stage 8"
                                    width={500}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Stage 9 */}
                        <div className="rounded-lg bg-gray-800 p-6">
                            <h3 className="mb-4 text-xl font-bold text-white">Stage 9</h3>
                            <div className="mb-6">
                                <Image
                                    src="https://hackmd.io/_uploads/H1ADuAYY1x.png"
                                    alt="Stage 9"
                                    width={500}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                        {/* Stage 10 */}
                        <div className="rounded-lg bg-gray-800 p-6">
                            <h3 className="mb-4 text-xl font-bold text-white">Stage 10</h3>
                            <div className="mb-6">
                                <Image
                                    src="https://hackmd.io/_uploads/ByKq_RFt1e.png"
                                    alt="Stage 10"
                                    width={500}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Stage 11 */}
                        <div className="rounded-lg bg-gray-800 p-6">
                            <h3 className="mb-4 text-xl font-bold text-white">Stage 11</h3>
                            <div className="mb-6">
                                <Image
                                    src="https://hackmd.io/_uploads/rknTOCtKkg.png"
                                    alt="Stage 11"
                                    width={500}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="rounded bg-gray-700/50 p-4">
                                    <p className="text-gray-300">奇怪，終點怎麼不見了？</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <p className="text-gray-300">原來終點在二樓！</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <p className="text-gray-300">使用電梯，就能任意上下樓了！</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <p className="text-gray-300">選擇上樓。</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <p className="text-gray-300">接著，從電梯所在地接著出發前往終點吧。</p>
                                </div>
                                <div className="rounded bg-gray-700/50 p-4">
                                    <p className="text-gray-300">除了上樓也可以下樓，就算起點終點在同樓層，還能用來閃避障礙物。在適當的時機，選擇適合的道具，也是找到逃逸路線的關鍵！</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
}