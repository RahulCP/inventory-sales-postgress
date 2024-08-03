--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-08-03 21:07:17 IST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16396)
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    code character varying(50),
    category character varying(50),
    sellingprice numeric,
    price numeric,
    quantity integer,
    image character varying(255),
    publish boolean,
    publishedurl character varying(50),
    boxno integer,
    systemdate timestamp with time zone,
    inventoryid bigint,
    id integer NOT NULL,
    purchasedate date
);


ALTER TABLE public.items OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16435)
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_id_seq OWNER TO postgres;

--
-- TOC entry 3607 (class 0 OID 0)
-- Dependencies: 216
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- TOC entry 217 (class 1259 OID 16497)
-- Name: sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales (
    id bigint NOT NULL,
    items jsonb,
    sales_date date,
    price numeric(10,2),
    buyer_details text,
    phone_number character varying(15),
    sales_status character varying(2),
    system_date timestamp without time zone,
    give_away boolean,
    shipment_date date,
    shipment_price numeric(10,2),
    shipment_method character varying(10),
    tracking_id character varying(50),
    name character varying(255)
);


ALTER TABLE public.sales OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16504)
-- Name: sales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_id_seq OWNER TO postgres;

--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 218
-- Name: sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sales_id_seq OWNED BY public.sales.id;


--
-- TOC entry 3448 (class 2604 OID 16436)
-- Name: items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- TOC entry 3449 (class 2604 OID 16505)
-- Name: sales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales ALTER COLUMN id SET DEFAULT nextval('public.sales_id_seq'::regclass);


--
-- TOC entry 3597 (class 0 OID 16396)
-- Dependencies: 215
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (code, category, sellingprice, price, quantity, image, publish, publishedurl, boxno, systemdate, inventoryid, id, purchasedate) FROM stdin;
illolam_127	2	640	240	5	/images/illolam_127.jpg	f		8	2024-08-03 11:19:22.605+05:30	1722664162605	128	2024-08-03
illolam_85	5	700	430	4	/images/illolam_85.jpg	f		9	2024-08-03 10:49:10.58+05:30	1722662350580	86	2024-08-03
illolam_89	1	800	455	1	/images/illolam_89.jpg	f		9	2024-08-03 10:51:22.059+05:30	1722662482059	90	2024-08-03
illolam_91	1	540	220	4	/images/illolam_91.jpg	f		9	2024-08-03 10:52:24.861+05:30	1722662544861	92	2024-08-03
illolam_93	2	1300	850	6	/images/illolam_93.jpg	f		9	2024-08-03 10:55:07.586+05:30	1722662707586	94	2024-08-03
illolam_87	1	540	220	6	/images/illolam_87.jpg	f		9	\N	1722662394650	88	2024-08-03
illolam_9		612	220	7	/images/illolam_9.jpg	f		6	2024-08-02 15:29:14.89+05:30	1722592754890	10	2024-08-02
illolam_13	1	810	460	2	/images/illolam_13.jpg	t		6	2024-08-02 15:33:11.464+05:30	1722592991464	14	2024-08-02
illolam_18	2	865	545	6	/images/illolam_18.jpg	f		6	2024-08-02 15:35:18.828+05:30	1722593118828	19	2024-08-02
illolam_25	1	820	500	1	/images/illolam_25.jpg	f		4	2024-08-02 15:40:08.822+05:30	1722593408822	26	2024-08-02
illolam_27	3	685	365	2	/images/illolam_27.jpg	f		4	2024-08-02 15:41:28.225+05:30	1722593488225	28	2024-08-02
illolam_29	2	530	210	5	/images/illolam_29.jpg	f		4	2024-08-02 15:46:55.79+05:30	1722593815790	30	2024-08-02
illolam_32	3	810	490	6	/images/illolam_32.jpg	f		4	2024-08-02 15:49:26.048+05:30	1722593966048	33	2024-08-02
illolam_34		450	130	4	/images/illolam_34.jpg	f		4	2024-08-02 15:51:12.965+05:30	1722594072965	35	2024-08-02
illolam_36	3	1100	650	3	/images/illolam_36.jpg	f		4	2024-08-02 15:53:39.364+05:30	1722594219364	37	2024-08-02
illolam_38	3	1100	650	3	/images/illolam_38.jpg	f		4	2024-08-02 15:54:13.576+05:30	1722594253576	39	2024-08-02
illolam_20	2	605	285	5	/images/illolam_20.jpg	f		6	\N	1722593200448	21	2024-08-02
illolam_40	2	540	220	5	/images/illolam_40.jpg	f		10	2024-08-02 16:00:00.625+05:30	1722594600625	41	2024-08-02
illolam_42	3	820	505	6	/images/illolam_42.jpg	f		10	2024-08-02 16:01:30.465+05:30	1722594690465	43	2024-08-02
illolam_44		589	260	2	/images/illolam_44.jpg	f		10	2024-08-02 16:02:11.955+05:30	1722594731955	45	2024-08-02
illolam_50		770	450	1	/images/illolam_50.jpg	f		2	2024-08-02 16:05:46.381+05:30	1722594946381	51	2024-08-02
illolam_52		700	380	1	/images/illolam_52.jpg	f		2	2024-08-02 16:06:54.831+05:30	1722595014831	53	2024-08-02
illolam_54	2	1125	655	4	/images/illolam_54.jpg	f		2	2024-08-02 16:08:00.359+05:30	1722595080359	55	2024-08-02
illolam_56		540	220	4	/images/illolam_56.jpg	f		2	2024-08-02 16:09:29.61+05:30	1722595169610	57	2024-08-02
illolam_58	2	750	455	4	/images/illolam_58.jpg	f		2	2024-08-02 16:10:33.022+05:30	1722595233022	59	2024-08-02
illolam_60	3	640	320	4	/images/illolam_60.jpg	f		2	2024-08-02 16:11:42.641+05:30	1722595302641	61	2024-08-02
illolam_62	2	780	460	3	/images/illolam_62.jpg	f		1	2024-08-02 16:13:05.431+05:30	1722595385431	63	2024-08-02
illolam_64		870	550	4	/images/illolam_64.jpg	f		1	2024-08-02 16:15:04.265+05:30	1722595504265	65	2024-08-02
illolam_66	2	610	260	3	/images/illolam_66.jpg	f		1	2024-08-02 16:15:42.776+05:30	1722595542776	67	2024-08-02
illolam_68	2	920	520	3	/images/illolam_68.jpg	f		1	2024-08-02 16:16:52.01+05:30	1722595612010	69	2024-08-02
illolam_74		1200	640	3	/images/illolam_74.jpg	f		1	2024-08-02 16:21:20.385+05:30	1722595880385	75	2024-08-02
illolam_76	4	640	330	3	/images/illolam_76.jpg	f		1	2024-08-02 16:22:49.216+05:30	1722595969216	77	2024-08-02
illolam_78		1100	640	3	/images/illolam_78.jpg	f		1	2024-08-02 16:24:09.941+05:30	1722596049941	79	2024-08-02
illolam_70		750	440	5	/images/illolam_70.jpg	f		1	\N	1722595744862	71	2024-08-02
illolam_95	5	700	380	1	/images/illolam_95.jpg	f		9	2024-08-03 10:57:43.266+05:30	1722662863266	96	2024-08-03
illolam_97	2	825	\N	3	/images/illolam_97.jpg	f		11	2024-08-03 10:59:00.843+05:30	1722662940843	98	2024-08-03
illolam_101	1	810	460	2	/images/illolam_101.jpg	f		11	2024-08-03 11:00:37.921+05:30	1722663037921	102	2024-08-03
illolam_103	1	810	460	3	/images/illolam_103.jpg	f		11	2024-08-03 11:01:09.945+05:30	1722663069945	104	2024-08-03
illolam_105	1	810	460	1	/images/illolam_105.jpg	f		11	2024-08-03 11:01:56.39+05:30	1722663116390	106	2024-08-03
illolam_107	1	810	460	2	/images/illolam_107.jpg	f		11	2024-08-03 11:02:25.333+05:30	1722663145333	108	2024-08-03
illolam_109	1	810	460	1	/images/illolam_109.jpg	f		11	2024-08-03 11:03:02.086+05:30	1722663182086	110	2024-08-03
illolam_111	2	700	380	1	/images/illolam_111.jpg	f		12	2024-08-03 11:07:24.629+05:30	1722663444629	112	2024-08-03
illolam_113		700	380	3	/images/illolam_113.jpg	f		12	2024-08-03 11:09:32.475+05:30	1722663572475	114	2024-08-03
illolam_115		700	380	3	/images/illolam_115.jpg	f		12	2024-08-03 11:10:09.911+05:30	1722663609911	116	2024-08-03
illolam_117		700	380	6	/images/illolam_117.jpg	f		12	2024-08-03 11:12:15.922+05:30	1722663735922	118	2024-08-03
illolam_119	2	600	200	3	/images/illolam_119.jpg	f		12	\N	1722663815078	120	2024-08-03
illolam_121		700	380	3	/images/illolam_121.jpg	f		12	2024-08-03 11:14:52.532+05:30	1722663892532	122	2024-08-03
illolam_123	2	399	189	3	/images/illolam_123.jpg	f		12	2024-08-03 11:16:26.02+05:30	1722663986020	124	2024-08-03
illolam_131	2	700	380	3	/images/illolam_131.jpg	f		8	2024-08-03 11:22:25.685+05:30	1722664345685	132	2024-08-03
illolam_133		700	380	2	/images/illolam_133.jpg	f		8	2024-08-03 11:23:04.036+05:30	1722664384036	134	2024-08-03
illolam_135	2	540	220	4	/images/illolam_135.jpg	f		14	2024-08-03 11:25:29.484+05:30	1722664529484	136	2024-08-03
illolam_137	2	850	510	1	/images/illolam_137.jpg	f		14	2024-08-03 11:27:23.763+05:30	1722664643763	138	2024-08-03
illolam_139	2	810	510	2	/images/illolam_139.jpg	f		14	2024-08-03 11:27:51.412+05:30	1722664671412	140	2024-08-03
illolam_141	2	849	510	1	/images/illolam_141.jpg	f		14	2024-08-03 11:29:34.222+05:30	1722664774222	142	2024-08-03
illolam_143	2	850	530	1	/images/illolam_143.jpg	f		13	2024-08-03 11:31:06.269+05:30	1722664866269	144	2024-08-03
illolam_145	3	545	240	4	/images/illolam_145.jpg	f		13	2024-08-03 11:32:49.362+05:30	1722664969362	146	2024-08-03
illolam_147		870	530	4	/images/illolam_147.jpg	f		13	2024-08-03 11:34:02.404+05:30	1722665042404	148	2024-08-03
illolam_149		680	360	5	/images/illolam_149.jpg	f		13	2024-08-03 11:37:19.357+05:30	1722665239357	150	2024-08-03
illolam_48	2	899	570	6	/images/illolam_48.jpg	t		2	\N	1722594886127	49	2024-08-03
illolam_46		870	550	6	/images/illolam_46.jpg	f		10	\N	1722594791309	47	2024-08-03
illolam_22		849	530	3	/images/illolam_22.jpg	t		4	\N	1722593330167	23	2024-08-03
illolam_72		1200	640	3	/images/illolam_72.jpg	f		1	\N	1722595804646	73	2024-08-03
illolam_125	3	399	180	3	/images/illolam_125.jpg	f		12	\N	1722664016053	126	2024-08-03
illolam_99	2	825	380	2	/images/illolam_99.jpg	f		11	\N	1722662970833	100	2024-08-03
illolam_151	5	280	72	4	/images/illolam_151.jpg	f		13	2024-08-03 11:42:24.365+05:30	1722665544365	152	2024-08-03
illolam_153		620	300	4	/images/illolam_153.jpg	f		5	2024-08-03 11:45:05.993+05:30	1722665705993	154	2024-08-03
illolam_155	3	580	260	3	/images/illolam_155.jpg	f		5	2024-08-03 11:46:54.67+05:30	1722665814670	156	2024-08-03
illolam_157		399	130	6	/images/illolam_157.jpg	f		5	2024-08-03 11:48:43.572+05:30	1722665923572	158	2024-08-03
illolam_159		680	360	3	/images/illolam_159.jpg	f		5	2024-08-03 11:50:32.58+05:30	1722666032580	160	2024-08-03
illolam_161	2	680	360	5	/images/illolam_161.jpg	f		5	2024-08-03 11:53:44.762+05:30	1722666224762	162	2024-08-03
illolam_165	3	1150	648	3	/images/illolam_165.jpg	f		3	2024-08-03 12:00:43.914+05:30	1722666643914	166	2024-08-03
illolam_167	3	1150	648	3	/images/illolam_167.jpg	f		3	2024-08-03 12:01:23.604+05:30	1722666683604	168	2024-08-03
illolam_170	2	1150	648	3	/images/illolam_170.jpg	f		3	2024-08-03 12:01:56.025+05:30	1722666716025	171	2024-08-03
illolam_172	3	470	150	6	/images/illolam_172.jpg	f		5	2024-08-03 12:04:00.439+05:30	1722666840439	173	2024-08-03
illolam_178		620	200	6	/images/illolam_178.jpeg	f		15	2024-08-03 12:08:49.273+05:30	1722667129273	179	2024-08-03
illolam_180		510	190	10	/images/illolam_180.jpg	f		15	2024-08-03 12:10:46.134+05:30	1722667246134	181	2024-08-03
illolam_184	3	520	200	6	/images/illolam_184.jpg	f		15	2024-08-03 12:12:05.066+05:30	1722667325066	185	2024-08-03
illolam_174	3	500	162	10	/images/illolam_174.jpg	f		3	\N	1722667026472	175	2024-08-03
illolam_186		560	216	10	/images/illolam_186.jpg	f		7	2024-08-03 12:15:43.366+05:30	1722667543366	187	2024-08-03
illolam_188		850	486	20	/images/illolam_188.jpg	f		7	2024-08-03 12:21:52.927+05:30	1722667912927	189	2024-08-03
illolam_190		1150	738	10	/images/illolam_190.jpg	f		7	2024-08-03 12:23:58.531+05:30	1722668038531	191	2024-08-03
illolam_194	2	560	216	5	/images/illolam_194.jpg	f		16	2024-08-03 12:31:35.744+05:30	1722668495744	195	2024-08-03
illolam_196		580	234	5	/images/illolam_196.jpg	f		16	2024-08-03 12:32:50.12+05:30	1722668570120	197	2024-08-03
illolam_198	3	500	162	6	/images/illolam_198.jpg	f		16	2024-08-03 12:33:33.976+05:30	1722668613976	199	2024-08-03
illolam_200		840	468	10	/images/illolam_200.jpg	f		16	2024-08-03 12:34:31.395+05:30	1722668671395	201	2024-08-03
illolam_202	2	470	135	5	/images/illolam_202.jpg	f		16	2024-08-03 12:35:48.905+05:30	1722668748905	203	2024-08-03
illolam_204	2	700	342	2	/images/illolam_204.jpg	f		17	2024-08-03 12:37:08.8+05:30	1722668828800	205	2024-08-03
illolam_206		800	396	3	/images/illolam_206.jpg	f		17	2024-08-03 12:38:49.465+05:30	1722668929465	207	2024-08-03
illolam_208		800	396	2	/images/illolam_208.jpg	f		17	2024-08-03 12:39:15.831+05:30	1722668955831	209	2024-08-03
illolam_210		560	240	6	/images/illolam_210.jpg	f		18	\N	1722669041252	211	2024-08-03
illolam_212		900	580	4	/images/illolam_212.jpg	f		17	2024-08-03 12:41:41.49+05:30	1722669101490	213	2024-08-03
illolam_214		450	117	6	/images/illolam_214.jpg	f		17	2024-08-03 12:43:33.041+05:30	1722669213041	215	2024-08-03
illolam_216		900	522	6	/images/illolam_216.jpg	f		17	2024-08-03 12:44:29.265+05:30	1722669269265	217	2024-08-03
illolam_218		540	220	5	/images/illolam_218.jpg	f		18	2024-08-03 12:45:33.32+05:30	1722669333320	219	2024-08-03
illolam_220		510	190	6	/images/illolam_220.jpg	f		18	2024-08-03 12:47:14.285+05:30	1722669434285	221	2024-08-03
illolam_222		1290	615	6	/images/illolam_222.jpg	f		2	2024-08-03 12:50:58.372+05:30	1722669658372	223	2024-08-03
illolam_129	2	810	490	4	/images/illolam_129.jpg	t		8	\N	1722664276758	130	2024-08-03
illolam_182	3	540	220	6	/images/illolam_182.jpg	f		15	\N	1722667292353	183	2024-08-03
illolam_231	2	15584	8112	1	/images/illolam_231.png	f		1111	\N	1722681470691	232	2024-08-03
illolam_226	1	120953	65923	1	/images/illolam_226.jpg	f		11111	\N	1722681248402	227	2024-08-03
illolam_224	2	750	445	3	/images/illolam_224.jpg	f		4	\N	1722669916919	225	2024-08-03
\.


--
-- TOC entry 3599 (class 0 OID 16497)
-- Dependencies: 217
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales (id, items, sales_date, price, buyer_details, phone_number, sales_status, system_date, give_away, shipment_date, shipment_price, shipment_method, tracking_id, name) FROM stdin;
33	{"1722668495744": [1, "560", 0]}	2024-08-03	560.00	GMS consultant Pvt ltd\n2nd floor,Monlash Business center\nCrescens Tower,Kalmassery\nCochin : 682033	9633282737	SP	2024-08-03 00:00:00	f	\N	\N	\N	\N	Sonia Thomas
34	{"1722668495744": [1, "560", 0]}	2024-08-03	560.00	flat no 11 b,\n jgt samruthi,\n kadavanthara, \ncochin - 682020	9961086999	SP	2024-08-03 00:00:00	f	\N	\N	\N	\N	Dhanya anna mammen
35	{"1722668828800": [1, "700", 0]}	2024-08-03	700.00	Copperhills Apartment \nTower A \nKollamkudimughal \nThrikkakara \n682021\n	9048689999	SP	2024-08-03 00:00:00	f	\N	\N	\N	\N	Leviya Vijayan 
36	{"1722663986020": [1, "399", 0], "1722668495744": [1, "560", 0]}	2024-08-03	959.00	Alakapuri ,\nT P Puram ,\nVazhoor,\nKottayam, Kerala\nPin 686504\n	9447464386	SP	2024-08-03 00:00:00	f	\N	\N	\N	\N	P R Ramachandran Nair
38	{"1722667292353": [1, "540", 0]}	2024-08-03	540.00	W/O Varghese  P F\nPadayattil  house\nWest Gosayikunnu\nKuriachira\nHouse no:21 A\nPin - 680006	8075468935	SP	2024-08-03 00:00:00	f	\N	\N	\N	\N	Maria Simonn
39	{"1722663815078": [1, "600", 0]}	2024-08-03	600.00	Ambanappillil  (h)\nayavana po \nKarimattam \nPin 686668\nMuvattupuzha \nErnakulam	9633886338	SP	2024-08-03 00:00:00	f	\N	\N	\N	\N	Eldho paulose 
40	{"1722592754890": [1, "612", 15], "1722664969362": [1, "545", 0], "1722669101490": [1, "900", 15]}	2024-08-03	1830.20	House no 65\nV and V penta \nP kesavdev Dev road \nMudavanmughal Poojappura p.o \nPin 695012\n	6238060792	SP	2024-08-03 00:00:00	f	\N	\N	\N	\N	Devi M Nair
41	{"1722668495744": [1, "560", 15], "1722668748905": [1, "470", 15]}	2024-08-03	876.00	HSST Computer Application \nSt.Marys HSS Niranam \nNiranam P O \nTiruvalla 689621\n	9400671150	SP	2024-08-03 00:00:00	f	\N	\N	\N	\N	Radhika S
42	{"1722681248402": [1, "120953", 0]}	2024-08-03	120953.00	hghsdgsdhs	454545454	SD	2024-08-03 00:00:00	f	2024-08-03	400.00			Back Date
43	{"1722681470691": [1, "15584", 0]}	2024-08-03	15584.00	eerere	4545454	SD	2024-08-03 00:00:00	f	2024-08-03	0.00			Back Date
37	{"1722595804646": [1, "1200", 20], "1722662970833": [1, "850", 20], "1722664016053": [1, "399", 20], "1722667292353": [1, "540", 20], "1722669916919": [1, "750", 20]}	2024-08-03	2991.20	C/o Mr. Gopalakrishna Pillai, \nTC 13/1666-1,\nKannampallil House, \n, Medical College PO, \nThiruvananthapuram 695011	7012856072	SP	2024-08-03 00:00:00	f	\N	\N	\N	\N	Nisha J U Nair
\.


--
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 216
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_id_seq', 234, true);


--
-- TOC entry 3613 (class 0 OID 0)
-- Dependencies: 218
-- Name: sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sales_id_seq', 43, true);


--
-- TOC entry 3451 (class 2606 OID 16438)
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- TOC entry 3453 (class 2606 OID 16503)
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);


--
-- TOC entry 3606 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.items TO illolam;


--
-- TOC entry 3608 (class 0 OID 0)
-- Dependencies: 216
-- Name: SEQUENCE items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.items_id_seq TO illolam;


--
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE sales; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sales TO illolam;


--
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 218
-- Name: SEQUENCE sales_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.sales_id_seq TO illolam;


-- Completed on 2024-08-03 21:07:17 IST

--
-- PostgreSQL database dump complete
--

