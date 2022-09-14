//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const { windPressure, windCategory } = require("./modules/pressureCalc");
const res = require("express/lib/response");
const homeRoutes = require("./routes/home-routes");
const path = require("path");
const alert = require("alert");
const expressLayouts = require("express-ejs-layouts");



//db.js

const url = "mongodb+srv://BurhanIqbal:Pakistan1234@cluster0.oddvb.mongodb.net/?retryWrites=true&w=majority";

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

const {
  analysis,
  beamdesign,
  rafterdesign,
  rafterdesignE,
  IntermediateFB,
  IntermediateSides,
  GirtsFB,
  GirtsSi,
  PoleDesignI,
  PoleDesignE,
} = require("./views/mdesign.js");
const fs = require("fs");
const pdf = require("pdf-parse");

const { snowLoads } = require("./modules/snowloads");
const {
  options,
  shedType,
  roofType,
  condition,
  PSize,
  RSize,
  RESize,
  IFb,
  Fb,
  ISi,
  GFb,
  GSi,
  Eq,
  Db,
  MPi,
  EPi,
  b2,
  calcs,
  cer,
  IInfo,
  PrSize,
  PropQ,
  PDisplay,
  ReDisplay,
  PeDisplay,
  PiDisplay,
  RDisplay,
  InDisplay,
  InSideDisplay,
  BI,
  BE,
  BProp,
  IFBAuto,
  ISIAuto,
} = require("./modules/selection");
const {
  rackingForceM,
  rackingForceE,
  bayWidth,
  rackingForceHeight,
  upliftArea,
} = require("./modules/rackingforces");
const { redirect, render, type } = require("express/lib/response");
const req = require("express/lib/request");
const { Console } = require("console");

// const speed = req.body.windSpeed;


const DL = 0.25;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use("/docs", express.static(path.join(__dirname, "docs")));
app.use(homeRoutes.routes);
let addedwidth = "";
let PoleLoadWidth = "";
let RISManual = "";

// mongoose.connect("mongodb://localhost:27017/polesDB");
const jobSchema = {
  jobNumber: String,
  address: String,
  date: String,
  latitude: Number,
  longitude: Number,
  elevation: Number,
  wRegion: String,
  tc: String,
  lee: Number,
  leeZone: String,
  WSpeed: Number,
  ari: Number,
  shedType: [],
  length: Number,
  width: Number,
  chlength: Number,
  chwidth: Number,
  noOfBays: Number,
  noOfColInMiddleBay: Number,
  NoOfColInEndBay: Number,
  MaxHeight: Number,
  roofType: [],
  RoofPitch: Number,
  condition: [],
  windSpeed: Number,
  snowZone: String,
  SElev: Number,
  RSnowLoad: Number,
  GSnowLoad: Number,
  windPressure1: Number,
  windCategory: String,
  rackingM: String,
  rackingE: Number,
  bayWidth: Number,
  RackForceHeight: Number,
  upliftMiddleMiddle: Number,
  upliftMiddleEnd: Number,
  selected: [],
  PSize: [],
  RSize: [],
  RESize: [],
  IFb: [],
  ISi: [],
  GFb: [],
  GSi: [],
  Fb: [],
  Eq: [],
  Db: [],
  MPi: [],
  EPi: [],
  b2: [],
  calcs: [],
  cer: [],
  IInfo: [],
  PDisplay: [],
  ReDisplay: [],
  PeDisplay: [],
  PiDisplay: [],
  RDisplay: [],
  InDisplay: [],
  InSideDisplay: [],
  BI: [],
  BE: [],
  BProp: [],
  IFBAuto: [],
  ISIAuto: [],
  PrSize: [],
  PropQ: [],
  Dl: Number,
  Ll: Number,
  Wu: Number,
  Wd: Number,
  Snd: Number,
  Snl: Number,
  PSpacing: Number,
  RSpacing: Number,
  PSpan: Number,
  RSpan: Number,
  PDepthI: Number,
  PDepthE: Number,
  moisture: String,
  d: Number,
  b: Number,
  grade: String,
  PProperties: [],
  PAnalysis: [],
  RafterCapacity: [],
  RafterCapacityE: [],
  IntermediateFrontBack: [],
  IntermediateSIDES: [],
  GirtsFrontBack: [],
  GirtsSides: [],
  PoleDesignInternal: [],
  PoleDesignExternal: [],
  BRes: Number,
  TRes: Number,
  Blocking: Number,
  MomentLong: Number, // applied
  MomentMedium: Number, // applied
  MomentShort: Number, // applied
  Momentupshort: String, // capacity
  MomentDownmedium: String, // capacity
  MomentDownlong: String, //capacity
  EqZone: Number,
  DZone: String,
  MaxGirtSpan: Number,
};

const d = new Date();
let today = d.toLocaleDateString();

const Job = mongoose.model("Job", jobSchema);

app.get("/", function (req, res) {
  res.render("list", {
    windPressure1: 0,
    windCategory: "None",
    rackingM: 0,
    rackingE: 0,
    bayWidth: 0,
    RackForceHeight: 0,
    upliftMiddleMiddle: 0,
    upliftMiddleEnd: 0,
    jobNumber: "",
    address: "  ",
    date: today,
    latitude: " ",
    longitude: " ",
    elevation: "",
    wRegion: "",
    ari: "",
    tc: "",
    lee: "",
    leeZone: "",
    WSpeed: "",
    shedType: " ",
    length: " ",
    width: " ",
    chlength: " ",
    chwidth: " ",
    noOfBays: " ",
    noOfColInMiddleBay: " ",
    NoOfColInEndBay: " ",
    MaxHeight: " ",
    roofType: " ",
    RoofPitch: " ",
    condition: " ",
    windSpeed: " ",
    snowZone: " ",
    SElev: " ",
    RSnowLoad: " ",
    GSnowLoad: " ",
    selected: " ",
    PSize: " ",
    RSize: "",
    RESize: "",
    IFb: "",
    ISi: "",
    GFb: "",
    GSi: "",
    Fb: "",
    Eq: "",
    Db: "",
    MPi: "",
    EPi: "",
    b2: "",
    cer: "",
    IInfo: "",
    PDisplay: "",
    ReDisplay: "",
    PeDisplay: "",
    PiDisplay: "",
    RDisplay: "",
    InDisplay: "",
    InSideDisplay: "",
    BI: "",
    BE: "",
    BProp: "",
    IFBAuto: "",
    ISIAuto: "",
    PrSize: "",
    PropQ: "",
    calcs: "",
    PSpacing: " ",
    PDepthI: "",
    PDepthE: "",
    PProperties: " ",
    PAnalysis: " ",
    RafterCapacity: "",
    RafterCapacityE: "",
    IntermediateFrontBack: "",
    IntermediateSIDES: "",
    GirtsFrontBack: "",
    GirtsSides: "",
    PoleDesignInternal: "",
    PoleDesignExternal: "",
    Blocking: " ",
    MomentLong: " ",
    MomentMedium: " ",
    MomentShort: "",
    Momentupshort: " ", // capacity
    MomentDownmedium: " ", // capacity
    MomentDownlong: " ", //capacity
    EqZone: "",
    DZone: "",
    MaxGirtSpan: "",
  });
});

app.get("/:ejobNumber", function (req, res) {
  let ejobNumber = req.params.ejobNumber;
  if (ejobNumber === "jobList.ejs") {
    Job.find({}, function (err, foundJobs) {
      res.render("jobList", { jobs: foundJobs });
    });
  } else {
    Job.findOne({ jobNumber: ejobNumber }, function (err, foundJob) {
      if (!err) {
        if (!foundJob) {
          console.log("no job found");
        } else {
          console.log("Data rendered from found job");
          exports.foundJob = foundJob;
          res.render("list", {
            jobNumber: foundJob.jobNumber,
            address: foundJob.address,
            date: foundJob.date,
            latitude: foundJob.latitude,
            longitude: foundJob.longitude,
            elevation: foundJob.elevation,
            wRegion: foundJob.wRegion,
            ari: foundJob.ari,
            tc: foundJob.tc,
            lee: foundJob.lee,
            leeZone: foundJob.leeZone,
            WSpeed: foundJob.WSpeed,
            shedType: foundJob.shedType,
            length: foundJob.length,
            width: foundJob.width,
            chlength: foundJob.chlength,
            chwidth: foundJob.chwidth,
            noOfBays: foundJob.noOfBays,
            noOfColInMiddleBay: foundJob.noOfColInMiddleBay,
            NoOfColInEndBay: foundJob.NoOfColInEndBay,
            MaxHeight: foundJob.MaxHeight,
            roofType: foundJob.roofType,
            RoofPitch: foundJob.RoofPitch,
            condition: foundJob.condition,
            windSpeed: foundJob.windSpeed,
            snowZone: foundJob.snowZone,
            SElev: foundJob.SElev,
            RSnowLoad: foundJob.RSnowLoad,
            GSnowLoad: foundJob.GSnowLoad,
            windPressure1: foundJob.windPressure1,
            windCategory: foundJob.windCategory,
            rackingM: foundJob.rackingM,
            rackingE: foundJob.rackingE,
            bayWidth: foundJob.bayWidth,
            RackForceHeight: foundJob.RackForceHeight,
            upliftMiddleMiddle: foundJob.upliftMiddleMiddle,
            upliftMiddleEnd: foundJob.upliftMiddleEnd,
            selected: foundJob.selected,
            PSize: foundJob.PSize,
            RSize: foundJob.RSize,
            RESize: foundJob.RESize,
            IFb: foundJob.IFb,
            ISi: foundJob.ISi,
            Fb: foundJob.Fb,
            GFb: foundJob.GFb,
            GSi: foundJob.GSi,
            Eq: foundJob.Eq,
            Db: foundJob.Db,
            MPi: foundJob.MPi,
            EPi: foundJob.EPi,
            b2: foundJob.b2,
            cer: foundJob.cer,
            IInfo: foundJob.IInfo,
            PDisplay: foundJob.PDisplay,
            ReDisplay: foundJob.ReDisplay,
            PeDisplay: foundJob.PeDisplay,
            PiDisplay: foundJob.PiDisplay,
            RDisplay: foundJob.RDisplay,
            InDisplay: foundJob.InDisplay,
            InSideDisplay: foundJob.InSideDisplay,
            BI: foundJob.BI,
            BE: foundJob.BE,
            BProp: foundJob.BProp,
            IFBAuto: foundJob.IFBAuto,
            ISIAuto: foundJob.ISIAuto,
            PrSize: foundJob.PrSize,
            PropQ: foundJob.PropQ,
            calcs: foundJob.calcs,
            PSpacing: foundJob.PSpacing,
            PDepthI: foundJob.PDepthI,
            PDepthE: foundJob.PDepthE,
            PProperties: foundJob.PProperties[0],
            PAnalysis: foundJob.PAnalysis[0],
            RafterCapacity: foundJob.RafterCapacity[0],
            RafterCapacityE: foundJob.RafterCapacityE[0],
            IntermediateFrontBack: foundJob.IntermediateFrontBack[0],
            IntermediateSIDES: foundJob.IntermediateSIDES[0],
            GirtsFrontBack: foundJob.GirtsFrontBack[0],
            GirtsSides: foundJob.GirtsSides[0],
            PoleDesignInternal: foundJob.PoleDesignInternal[0],
            PoleDesignExternal: foundJob.PoleDesignExternal[0],
            Blocking: foundJob.Blocking,
            MomentLong: foundJob.MomentLong,
            MomentMedium: foundJob.MomentMedium,
            MomentShort: foundJob.MomentShort,
            Momentupshort: foundJob.Momentupshort,
            MomentDownmedium: foundJob.MomentDownmedium, // capacity
            MomentDownlong: foundJob.MomentDownlong, //capacity
            EqZone: foundJob.EqZone,
            DZone: foundJob.DZone,
            MaxGirtSpan: foundJob.MaxGirtSpan,
          });
        }
      }
    });
  }
});

app.post("/", function (req, res) {
  let ejobNumber = req.body.jobNumber;
  let dataBuffer = fs.readFileSync(
    "C:/Steel Clients/Sheds/" + ejobNumber + "/Site Report.pdf"
  );
  pdf(dataBuffer).then(function (data) {
    chlength = data.text
      .substring(
        data.text.indexOf("LENGTH") + 7,
        data.text.lastIndexOf("HEIGHT")
      )
      .substring(0, 5);

    chwidth = data.text
      .substring(
        data.text.indexOf("WIDTH") + 6,
        data.text.lastIndexOf("LENGTH") - 4
      )
      .substring(0, 5);

    latitude = data.text.substring(
      data.text.indexOf("LATITUDE") + 9,
      data.text.lastIndexOf("LONGITUDE")
    );
    longitude = data.text.substring(
      data.text.indexOf("LONGITUDE") + 10,
      data.text.lastIndexOf("ELEVATION")
    );
    elevation = data.text
      .substring(
        data.text.indexOf("ELEVATION:") + 10,
        data.text.lastIndexOf("WIND") - 2
      )
      .substring(0, 6);
    wRegion = data.text.substring(
      data.text.indexOf("REGION") + 7,
      data.text.lastIndexOf("ULTIMATEARI")
    );
    tc = data.text.substring(
      data.text.indexOf("TC:") + 3,
      data.text.lastIndexOf("Mz,cat:")
    );
    lee = data.text.substring(
      data.text.indexOf("Mlee:") + 5,
      data.text.lastIndexOf("Mel:")
    );
    WSpeed = data.text.substring(
      data.text.indexOf("Vdes") + 7,
      data.text.lastIndexOf("m/s") - 1
    );

    ari = data.text.substring(
      data.text.indexOf("ULTIMATEARI") + 12,
      data.text.lastIndexOf("YEARS")
    );

    if (lee > 1) {
      leeZone = " YES";
    } else {
      leeZone = "NO";
    }

    if (req.body.calcs == "Auto") {
      addedwidth = bayWidth(req.body.Length, req.body.noOfBays);
      PoleLoadWidth = bayWidth(req.body.Length, req.body.noOfBays);
      RISManual = ((chwidth * 1000) / req.body.noOfColInMiddleBay);
    } else {
      addedwidth = Number(req.body.pSpanManual);
      PoleLoadWidth = Number(req.body.PLWManual);
      RISManual = Number(req.body.RISManual);
    }
    
    Moment = analysis(
      DL,
      0.25,
      req.body.RMaxU,
      req.body.RMaxD,
      snowLoads(elevation, req.body.snowZone, req.body.RoofPitch)[1],
      addedwidth - 200,
      RISManual,
      req.body.pSpacing,
      PoleLoadWidth,
      (
        (chwidth * 1000) /
          req.body.NoOfColInEndBay /
          Math.cos((req.body.RoofPitch * Math.PI) / 180) -
        200
      ).toFixed(0),
      addedwidth / 2,
      req.body.PropQ,
      req.body.PropL,
      req.body.MMomentLong,
      req.body.MMomentMedium,
      req.body.MMomentShort,
      req.body.MReactionLong,
      req.body.MReactionMedium,
      req.body.MReactionShort,
      req.body.MReaction2Long,
      req.body.MReaction2Medium,
      req.body.MReaction2Short,
      req.body.MReactionPropLong,
      req.body.MReactionPropMedium,
      req.body.MReactionPropShort
    );

    GirtsFrontBack = GirtsFB(
      req.body.GirtsFB,
      addedwidth,
      req.body.gSpacing,
      req.body.WMax,
      snowLoads(elevation, req.body.snowZone, req.body.RoofPitch)[1],
      req.body.MaxGirtSpan,
      req.body.gFBBlocking
    );

    GirtsSides = GirtsSi(
      req.body.GirtsSi,
      (chwidth / req.body.NoOfColInEndBay) * 1000,
      req.body.gsSpacing,
      req.body.WMax,
      snowLoads(elevation, req.body.snowZone, req.body.RoofPitch)[1],
      req.body.MaxGirtSpan,
      req.body.gSIBlocking
    );

    MomentLong = Moment[0].MomentLong;
    MomentMedium = Moment[0].MomentMedium;
    MomentShort = Moment[0].MomentShort;
    MomentCapacity = beamdesign(
      req.body.purlinSize,
      (addedwidth - 200) / req.body.Blocking,
      900,
      DL,
      req.body.pSpacing,
      addedwidth - 200,
      req.body.RMaxU,
      req.body.RMaxD,
      0.25,
      addedwidth,
      (chwidth / req.body.noOfColInMiddleBay) * 1000 - 200
    );

    RafterCapacity = rafterdesign(
      req.body.rafterSize,
      DL,
      PoleLoadWidth,
      RISManual,
      req.body.RMaxU,
      req.body.RMaxD,
      0.25,
      req.body.noOfColInMiddleBay,
      req.body.PropQ,
      req.body.PropInternal,
      req.body.PropL,
      req.body.MDefShort,
      req.body.MDefLong,
      req.body.RBoltInternal,
      req.body.Noda,
      req.body.MPole,
      req.body.RBoltProp,
      req.body.NodaProp
    );
    RafterCapacityE = rafterdesignE(
      req.body.rafterSizeE,
      DL,
      addedwidth / 2,
      (chwidth * 1000) / req.body.NoOfColInEndBay,
      req.body.RMaxU,
      req.body.RMaxD,
      0.25,
      req.body.RBoltExternal,
      req.body.NodaEx
    );

    IntermediateFrontBack = IntermediateFB(
      req.body.IntermediateFB,
      req.body.FrontorBack,
      req.body.MaxHeight,
      req.body.RoofPitch,
      addedwidth,
      req.body.WMax,
      snowLoads(req.body.SElev, req.body.snowZone, req.body.RoofPitch)[0],
      req.body.roofType,
      chwidth,
      req.body.MaxGirtSpan,
      req.body.IFBAuto,
      req.body.IFBSpan,
      req.body.IFBWidth
    );
    IntermediateSIDES = IntermediateSides(
      req.body.IntermediateSides,
      req.body.roofType,
      req.body.MaxHeight,
      req.body.RoofPitch,
      chwidth / req.body.NoOfColInEndBay,
      req.body.WMax,
      snowLoads(req.body.SElev, req.body.snowZone, req.body.RoofPitch)[0],
      req.body.NoOfColInEndBay,
      chwidth,
      req.body.MaxGirtSpan,
      req.body.ISIAuto,
      req.body.ISISpan,
      req.body.ISIWidth
    );
    PoleDesignInternal = PoleDesignI(
      req.body.MPoleDepth,
      req.body.MaxHeight * 0.75,
      req.body.MPole,
      PoleLoadWidth,
      RISManual,
      req.body.RMaxD,
      snowLoads(req.body.SElev, req.body.snowZone, req.body.RoofPitch)[1],
      req.body.noOfColInMiddleBay,
      req.body.NoOfColInEndBay,
      req.body.noOfBays,
      req.body.Length,
      req.body.Width,
      snowLoads(req.body.SElev, req.body.snowZone, req.body.RoofPitch)[0],
      req.body.rafterSize,
      req.body.RFrom1,
      req.body.RTo1,
      req.body.RCPe1,
      req.body.Rpe1,
      req.body.Rpnet1,
      req.body.RFrom2,
      req.body.RTo2,
      req.body.RCpe2,
      req.body.Rpe2,
      req.body.Rpnet2,
      req.body.WFrom1,
      req.body.WTo1,
      req.body.WCPe1,
      req.body.Wpe1,
      req.body.Wpnet1,
      req.body.WFrom2,
      req.body.WTo2,
      req.body.WCpe2,
      req.body.Wpe2,
      req.body.Wpnet2,
      req.body.Type,
      req.body.WCpi1,
      req.body.WCpi2,
      req.body.RCpi2,
      req.body.RMaxD,
      req.body.RMaxU,
      req.body.WMax,
      req.body.RackMax,
      req.body.pSpanManual,
      req.body.calcs,
      req.body.cer,
      req.body.IInfo,
      req.body.MPoleHeight,
      req.body.MPoleRes,
      req.body.PropL,
      req.body.PropQ,
      req.body.MDeadLoad,
      req.body.MLiveLoad,
      req.body.MWindLoad,
      req.body.MSnowLoad,
      req.body.MWindDown,
      req.body.MWindLateral,
      req.body.MSnowLateral,
      req.body.MWindLateralPole,
      req.body.MSnowLateralPole,
      req.body.PDisplay,
      req.body.ReDisplay,
      req.body.RDisplay,
      req.body.roofType,
      req.body.InDisplay,
      req.body.PeDisplay,
      req.body.InSideDisplay,
      req.body.PiDisplay,
      DL,
      req.body.soilCohesion,
      req.body.soilFriction,
      req.body.soilDensity
    );
    PoleDesignExternal = PoleDesignE(
      req.body.EPoleDepth,
      req.body.MaxHeight * 0.75,
      req.body.EPole,
      addedwidth / 2,
      (chwidth * 1000) / req.body.NoOfColInEndBay,
      req.body.RMaxD,
      snowLoads(req.body.SElev, req.body.snowZone, req.body.RoofPitch)[1],
      req.body.NoOfColInEndBay,
      snowLoads(req.body.SElev, req.body.snowZone, req.body.RoofPitch)[0],
      req.body.rafterSizeE,
      req.body.RMaxD,
      req.body.RMaxU,
      req.body.WMax,
      req.body.RackMax,
      req.body.council,
      req.body.pages,
      req.body.dated,
      req.body.b2,
      req.body.soil,
      DL,
      req.body.soilCohesion,
      req.body.soilFriction,
      req.body.soilDensity
    );

    Momentupshort = MomentCapacity[0].Momentupshort || 0;
    MomentDownmedium = MomentCapacity[0].MomentDownmedium || 0;
    MomentDownlong = MomentCapacity[0].MomentDownlong || 0;
  });

  Job.findOne({ jobNumber: req.body.jobNumber }, function (err, foundJob) {
    if (foundJob) {
      Job.updateMany(
        { jobNumber: foundJob.jobNumber },
        {
          $set: {
            jobNumber: req.body.jobNumber,
            address: req.body.address,
            date: today,
            latitude: latitude,
            longitude: longitude,
            elevation: elevation,
            wRegion: wRegion,
            tc: tc,
            lee: lee,
            leeZone: leeZone,
            WSpeed: WSpeed,
            ari: ari,
            shedType: shedType(req.body.Type),
            length: req.body.Length,
            width: req.body.Width,
            chlength: chlength,
            chwidth: chwidth,
            noOfBays: req.body.noOfBays,
            noOfColInMiddleBay: req.body.noOfColInMiddleBay,
            NoOfColInEndBay: req.body.NoOfColInEndBay,
            MaxHeight: req.body.MaxHeight,
            roofType: roofType(req.body.roofType),
            RoofPitch: req.body.RoofPitch,
            condition: condition(req.body.Condition),
            windSpeed: req.body.windSpeed,
            snowZone: req.body.snowZone,
            SElev: req.body.SElev,
            RSnowLoad: snowLoads(
              req.body.SElev,
              req.body.snowZone,
              req.body.RoofPitch
            )[1],
            GSnowLoad: snowLoads(
              req.body.SElev,
              req.body.snowZone,
              req.body.RoofPitch
            )[0],
            windPressure1: windPressure(WSpeed),
            windCategory: windCategory(req.body.windSpeed),
            rackingM: rackingForceM(
              req.body.MaxHeight,
              req.body.Length,
              req.body.noOfBays,
              windPressure(req.body.windSpeed),
              req.body.noOfColInMiddleBay,
              snowLoads(
                req.body.SElev,
                req.body.snowZone,
                req.body.RoofPitch
              )[0] || 0
            ),
            rackingE:
              rackingForceE(
                req.body.MaxHeight,
                req.body.Length,
                req.body.noOfBays,
                windPressure(req.body.windSpeed),
                req.body.noOfColInMiddleBay,
                snowLoads(
                  req.body.SElev,
                  req.body.snowZone,
                  req.body.RoofPitch
                )[0]
              ) || 0,
            bayWidth: addedwidth,
            RackForceHeight: rackingForceHeight(req.body.MaxHeight),
            upliftMiddleMiddle:
              upliftArea(
                req.body.noOfColInMiddleBay,
                bayWidth(req.body.Length, req.body.noOfBays),
                req.body.Width,
                windPressure(req.body.windSpeed),
                req.body.Type
              )[1] || 0,
            upliftMiddleEnd:
              upliftArea(
                req.body.noOfColInMiddleBay,
                bayWidth(req.body.Length, req.body.noOfBays),
                req.body.Width,
                windPressure(req.body.windSpeed),
                req.body.Type
              )[0] || 0,
            selected: options(req.body.snowZone),
            PSize: PSize(req.body.purlinSize),
            RSize: RSize(req.body.rafterSize),
            RESize: RESize(req.body.rafterSizeE),
            IFb: IFb(req.body.IntermediateFB),
            ISi: ISi(req.body.IntermediateSides),
            GFb: GFb(req.body.GirtsFB),
            GSi: GSi(req.body.GirtsSi),
            Fb: Fb(req.body.FrontorBack),
            Eq: Eq(req.body.EqZone),
            Db: Db(req.body.DZone),
            MPi: MPi(req.body.MPole),
            EPi: EPi(req.body.EPole),
            b2: b2(req.body.b2),
            cer: cer(req.body.cer),
            IInfo: IInfo(req.body.IInfo),
            PDisplay: PDisplay(req.body.PDisplay),
            ReDisplay: ReDisplay(req.body.ReDisplay),
            PeDisplay: PeDisplay(req.body.PeDisplay),
            PiDisplay: PiDisplay(req.body.PiDisplay),
            RDisplay: RDisplay(req.body.RDisplay),
            InDisplay: InDisplay(req.body.InDisplay),
            InSideDisplay: InSideDisplay(req.body.InSideDisplay),
            BI: BI(req.body.RBoltInternal),
            BE: BE(req.body.RBoltExternal),
            BProp: BProp(req.body.RBoltProp),
            IFBAuto: IFBAuto(req.body.IFBAuto),
            ISIAuto: ISIAuto(req.body.ISIAuto),
            PrSize: PrSize(req.body.PropInternal),
            PropQ: PropQ(req.body.PropQ),
            calcs: calcs(req.body.calcs),
            PSpacing: req.body.pSpacing,
            PDepthI: req.body.MPoleDepth,
            PDepthE: req.body.EPoleDepth,
            PProperties: MomentCapacity[0],
            PAnalysis: Moment[0],
            RafterCapacity: RafterCapacity[0],
            RafterCapacityE: RafterCapacityE[0],
            IntermediateFrontBack: IntermediateFrontBack[0],
            IntermediateSIDES: IntermediateSIDES[0],
            GirtsFrontBack: GirtsFrontBack[0],
            GirtsSides: GirtsSides[0],
            PoleDesignInternal: PoleDesignInternal[0],
            PoleDesignExternal: PoleDesignExternal[0],
            Blocking: req.body.Blocking,
            MomentLong: MomentLong,
            MomentMedium: MomentMedium,
            MomentShort: MomentShort,
            Momentupshort: Momentupshort,
            MomentDownmedium: MomentDownmedium,
            MomentDownlong: MomentDownlong,
            EqZone: req.body.EqZone,
            DZone: req.body.DZone,
            MaxGirtSpan: req.body.MaxGirtSpan,
          },
        },

        (err, res) => {
          if (!err) {
            console.log("data updated");
          }
        }
      ),
        res.redirect("/" + foundJob.jobNumber);
    } else {
      const job = new Job({
        jobNumber: req.body.jobNumber,
        address: req.body.address,
        date: req.body.date,
        latitude: latitude,
        longitude: longitude,
        elevation: elevation,
        wRegion: wRegion,
        tc: tc,
        lee: lee,
        leeZone: leeZone,
        ari: ari,
        shedType: shedType(req.body.Type),
        length: req.body.Length,
        width: req.body.Width,
        chlength: chlength,
        chwidth: chwidth,
        noOfBays: req.body.noOfBays,
        noOfColInMiddleBay: req.body.noOfColInMiddleBay,
        NoOfColInEndBay: req.body.NoOfColInEndBay,
        MaxHeight: req.body.MaxHeight,
        roofType: roofType(req.body.roofType),
        RoofPitch: req.body.RoofPitch,
        condition: condition(req.body.Condition),
        windSpeed: req.body.windSpeed,
        WSpeed: WSpeed,
        snowZone: req.body.snowZone,
        SElev: req.body.SElev,
        RSnowLoad: snowLoads(
          req.body.SElev,
          req.body.snowZone,
          req.body.RoofPitch
        )[1],
        GSnowLoad: snowLoads(
          req.body.SElev,
          req.body.snowZone,
          req.body.RoofPitch
        )[0],
        windPressure1: windPressure(req.body.windSpeed),
        windCategory: windCategory(WSpeed),
        rackingM: rackingForceM(
          req.body.MaxHeight,
          req.body.Length,
          req.body.noOfBays,
          windPressure(req.body.windSpeed),
          req.body.noOfColInMiddleBay,
          snowLoads(req.body.SElev, req.body.snowZone, req.body.RoofPitch)[0]
        ),
        rackingE: rackingForceE(
          req.body.MaxHeight,
          req.body.Length,
          req.body.noOfBays,
          windPressure(req.body.windSpeed),
          req.body.noOfColInMiddleBay,
          snowLoads(req.body.SElev, req.body.snowZone, req.body.RoofPitch)[0]
        ),
        bayWidth: bayWidth(req.body.Length, req.body.noOfBays),
        RackForceHeight: rackingForceHeight(req.body.MaxHeight),
        upliftMiddleMiddle:
          upliftArea(
            req.body.noOfColInMiddleBay,
            bayWidth(req.body.Length, req.body.noOfBays),
            req.body.Width,
            windPressure(req.body.windSpeed),
            req.body.Type
          )[1] || 0,
        upliftMiddleEnd:
          upliftArea(
            req.body.noOfColInMiddleBay,
            bayWidth(req.body.Length, req.body.noOfBays),
            req.body.Width,
            windPressure(req.body.windSpeed),
            req.body.Type
          )[0] || 0,
        selected: options(req.body.snowZone),
        PSize: PSize(req.body.purlinSize[0]),
        ReDisplay: ReDisplay(req.body.ReDisplay[0]),
        PeDisplay: PeDisplay(req.body.PeDisplay[0]),
        PiDisplay: PiDisplay(req.body.PiDisplay[0]),
        RDisplay: RDisplay(req.body.RDisplay[0]),
        InDisplay: InDisplay(req.body.InDisplay[0]),
        InSideDisplay: InSideDisplay(req.body.InSideDisplay[0]),
        RSize: RSize(req.body.rafterSize[0]),
        RESize: RESize(req.body.rafterSizeE[0]),
        IFb: IFb(req.body.IntermediateFB),
        ISi: ISi(req.body.IntermediateSides),
        GFb: GFb(req.body.GirtsFB),
        GSi: GSi(req.body.GirtsSi),
        Fb: Fb(req.body.FrontorBack),
        Eq: Eq(req.body.EqZone),
        Db: Db(req.body.DZone),
        MPi: MPi(req.body.MPole),
        EPi: EPi(req.body.EPole),
        b2: b2(req.body.b2),
        cer: cer(req.body.cer),
        IInfo: IInfo(req.body.IInfo),
        PDisplay: PDisplay(req.body.PDisplay),
        PrSize: PrSize(req.body.PropInternal),
        BI: BI(req.body.RBoltInternal),
        BE: BE(req.body.RBoltExternal),
        BProp: BProp(req.body.RBoltProp),
        IFBAuto: IFBAuto(req.body.IFBAuto),
        ISIAuto: ISIAuto(req.body.ISIAuto),
        PropQ: PropQ(req.body.PropQ),
        calcs: calcs(req.body.calcs),
        PSpacing: req.body.pSpacing,
        PDepthI: req.body.MPoleDepth,
        PDepthE: req.body.EPoleDepth,
        PProperties: MomentCapacity[0],
        PAnalysis: Moment[0],
        RafterCapacity: RafterCapacity[0],
        RafterCapacityE: RafterCapacityE[0],
        IntermediateFrontBack: IntermediateFrontBack[0],
        IntermediateSIDES: IntermediateSIDES[0],
        GirtsFrontBack: GirtsFrontBack[0],
        GirtsSides: GirtsSides[0],
        PoleDesignInternal: PoleDesignInternal[0],
        PoleDesignExternal: PoleDesignExternal[0],
        Blocking: req.body.Blocking,
        MomentLong: MomentLong,
        MomentMedium: MomentMedium,
        MomentShort: MomentShort,
        Momentupshort: Momentupshort,
        MomentDownmedium: MomentDownmedium,
        MomentDownlong: MomentDownlong,
        EqZone: req.body.EqZone,
        DZone: req.body.DZone,
        MaxGirtSpan: req.body.MaxGirtSpan,
      });
      job.save();

      res.redirect("/" + req.body.jobNumber);
    }
  });
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  Job.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) {
      console.log("Successfully deleted checked item,");
      res.redirect("/jobList.ejs");
    }
  });
});

let port = process.env.PORT;
if(port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started successfully");
});
