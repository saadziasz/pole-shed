const fs = require("fs");
const pdf = require("pdf-creator-node");
const path = require("path");
const options = require("../helpers/options");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const foundJob = require("../app");

const job = [];

const generatePdf = async (req, res, next) => {
  const html = fs.readFileSync(
    path.join(__dirname, "../views/template.html"),
    "utf-8"
  );
  const filename = Math.random() + "_doc" + ".pdf";
  const bitmap = fs.readFileSync(__dirname + "/RnH.png");
  const logo = bitmap.toString("base64");
  job.push(foundJob);

  let dt = [
    {
      logo: logo,
      jobNumber: job[0].foundJob.jobNumber,
      address: job[0].foundJob.address,
      date: job[0].foundJob.date,
      latitude: job[0].foundJob.latitude,
      longitude: job[0].foundJob.longitude,
      elevation: job[0].foundJob.SElev,
      length: job[0].foundJob.length,
      width: job[0].foundJob.width,
      noOfBays: job[0].foundJob.noOfBays,
      noOfColInMiddleBay: job[0].foundJob.noOfColInMiddleBay,
      NoOfColInEndBay: job[0].foundJob.NoOfColInEndBay,
      MaxHeight: job[0].foundJob.MaxHeight,
      RoofPitch: job[0].foundJob.RoofPitch,
      windSpeed: job[0].foundJob.windSpeed,
      snowZone: job[0].foundJob.snowZone,
      RSnowLoad: job[0].foundJob.RSnowLoad,
      GSnowLoad: job[0].foundJob.GSnowLoad,
      ari: job[0].foundJob.ari,
      wRegion: job[0].foundJob.wRegion,
      tc: job[0].foundJob.tc,
      leeZone: job[0].foundJob.leeZone,
      windPressure1: job[0].foundJob.windPressure1,
      windCategory: job[0].foundJob.windCategory,
      rackingM: job[0].foundJob.rackingM,
      rackingE: job[0].foundJob.rackingE,
      bayWidth: job[0].foundJob.bayWidth,
      RackForceHeight: job[0].foundJob.RackForceHeight,
      upliftMiddleMiddle: job[0].foundJob.upliftMiddleMiddle,
      upliftMiddleEnd: job[0].foundJob.upliftMiddleEnd,
      MomentLong: job[0].foundJob.MomentLong,
      MomentLongRI: job[0].foundJob.PAnalysis[0].PMLongRI,
      MomentLongRE: job[0].foundJob.PAnalysis[0].PMLongRE,
      MomentMedium: job[0].foundJob.MomentMedium,
      MomentMediumRI: job[0].foundJob.PAnalysis[0].PMMediumRI,
      MomentMediumRE: job[0].foundJob.PAnalysis[0].PMMediumRE,
      MomentShort: job[0].foundJob.MomentShort,
      MomentShortRI: job[0].foundJob.PAnalysis[0].PMshortuRI,
      MomentShortRE: job[0].foundJob.PAnalysis[0].PMshortuRE,
      MomentShortINFB: job[0].foundJob.IntermediateFrontBack[0].PMshortu,
      MomentShortINSides: job[0].foundJob.IntermediateSIDES[0].PMshortu,
      Momentupshort: job[0].foundJob.Momentupshort,
      MomentupshortRI: job[0].foundJob.RafterCapacity[0].Momentupshort,
      MomentupshortRE: job[0].foundJob.RafterCapacityE[0].Momentupshort,
      MomentDownmedium: job[0].foundJob.MomentDownmedium,
      MomentDownmediumRI: job[0].foundJob.RafterCapacity[0].MomentDownmedium,
      MomentDownmediumRE: job[0].foundJob.RafterCapacityE[0].MomentDownmedium,
      MomentDownlong: job[0].foundJob.MomentDownlong,
      MomentDownlongRI: job[0].foundJob.RafterCapacity[0].MomentDownlong,
      MomentDownlongRE: job[0].foundJob.RafterCapacityE[0].MomentDownlong,
      Blocking: job[0].foundJob.Blocking - 1,
      Per1: (
        (job[0].foundJob.MomentDownlong * 100) /
        job[0].foundJob.MomentLong
      ).toFixed(2),
      Per1RI: (
        (job[0].foundJob.RafterCapacity[0].MomentDownlong * 100) /
        job[0].foundJob.PAnalysis[0].PMLongRI
      ).toFixed(2),
      Per1RE: (
        (job[0].foundJob.RafterCapacityE[0].MomentDownlong * 100) /
        job[0].foundJob.PAnalysis[0].PMLongRE
      ).toFixed(2),
      Per2: (
        (job[0].foundJob.PProperties[0].MomentDownmedium * 100) /
        job[0].foundJob.MomentMedium
      ).toFixed(2),
      Per2RI: (
        (job[0].foundJob.RafterCapacity[0].MomentDownmedium * 100) /
        job[0].foundJob.PAnalysis[0].PMMediumRI
      ).toFixed(2),
      Per2RE: (
        (job[0].foundJob.RafterCapacityE[0].MomentDownmedium * 100) /
        job[0].foundJob.PAnalysis[0].PMMediumRE
      ).toFixed(2),
      Per3: Math.abs(
        (job[0].foundJob.Momentupshort * 100) / MomentShort
      ).toFixed(2),
      Per3RI: Math.abs(
        (job[0].foundJob.RafterCapacity[0].Momentupshort * 100) /
          job[0].foundJob.PAnalysis[0].PMshortuRI
      ).toFixed(2),
      Per3RE: Math.abs(
        (job[0].foundJob.RafterCapacityE[0].Momentupshort * 100) /
          job[0].foundJob.PAnalysis[0].PMshortuRE
      ).toFixed(2),
      Per3FB: Math.abs(
        (job[0].foundJob.IntermediateFrontBack[0].Mnushort * 100) /
          job[0].foundJob.IntermediateFrontBack[0].MApplied
      ).toFixed(2),
      Per3Sides: Math.abs(
        (job[0].foundJob.IntermediateSIDES[0].Mnushort * 100) /
          job[0].foundJob.IntermediateSIDES[0].MApplied
      ).toFixed(2),
      Per3GFB: Math.abs(
        (job[0].foundJob.GirtsFrontBack[0].Mnushort * 100) /
          job[0].foundJob.GirtsFrontBack[0].MApplied
      ).toFixed(2),
      Per3GSides: Math.abs(
        (job[0].foundJob.GirtsSides[0].Mnushort * 100) /
          job[0].foundJob.GirtsSides[0].MApplied
      ).toFixed(2),
      K1short: job[0].foundJob.PProperties[0].k1Short,
      K1shortRI: job[0].foundJob.RafterCapacity[0].k1Short,
      K1shortRE: job[0].foundJob.RafterCapacityE[0].k1Short,
      K1shortFB: job[0].foundJob.IntermediateFrontBack[0].k1Short,
      K1shortGFB: job[0].foundJob.GirtsFrontBack[0].k1Short,
      K1shortGSide: job[0].foundJob.GirtsSides[0].k1Short,
      K1shortSides: job[0].foundJob.IntermediateSIDES[0].k1Short,
      K1medium: job[0].foundJob.PProperties[0].k1medium,
      K1mediumRI: job[0].foundJob.RafterCapacity[0].k1medium,
      K1mediumRE: job[0].foundJob.RafterCapacityE[0].k1medium,
      K1long: job[0].foundJob.PProperties[0].k1long,
      K1longRI: job[0].foundJob.RafterCapacity[0].k1long,
      K1longRE: job[0].foundJob.RafterCapacityE[0].k1long,
      k4: job[0].foundJob.PProperties[0].k4,
      k4RI: job[0].foundJob.RafterCapacity[0].k4,
      k4RE: job[0].foundJob.RafterCapacityE[0].k4,
      k4FB: job[0].foundJob.IntermediateFrontBack[0].k4,
      k4GFB: job[0].foundJob.GirtsFrontBack[0].k4,
      k4GSide: job[0].foundJob.GirtsSides[0].k4,
      k4Sides: job[0].foundJob.IntermediateSIDES[0].k4,
      k5: job[0].foundJob.PProperties[0].k5,
      k5RI: job[0].foundJob.RafterCapacity[0].k5,
      k5RE: job[0].foundJob.RafterCapacityE[0].k5,
      k5FB: job[0].foundJob.IntermediateFrontBack[0].k5,
      k5GFB: job[0].foundJob.GirtsFrontBack[0].k5,
      k5GSide: job[0].foundJob.GirtsSides[0].k5,
      k5Sides: job[0].foundJob.IntermediateSIDES[0].k5,
      k8down: job[0].foundJob.PProperties[0].k8down.toFixed(2),
      k8downRI: job[0].foundJob.RafterCapacity[0].k8down.toFixed(2),
      k8downRE: job[0].foundJob.RafterCapacityE[0].k8down.toFixed(2),
      k8downFB: job[0].foundJob.IntermediateFrontBack[0].k8down.toFixed(2),
      k8downGFB: job[0].foundJob.GirtsFrontBack[0].k8down.toFixed(2),
      k8downGSide: job[0].foundJob.GirtsSides[0].k8down.toFixed(2),
      k8downSides: job[0].foundJob.IntermediateSIDES[0].k8down.toFixed(2),
      k8top: job[0].foundJob.PProperties[0].k8top.toFixed(2),
      k8topRI: job[0].foundJob.RafterCapacity[0].k8top.toFixed(2),
      k8topRE: job[0].foundJob.RafterCapacityE[0].k8top.toFixed(2),
      k8topFB: job[0].foundJob.IntermediateFrontBack[0].k8top.toFixed(2),
      k8topGFB: job[0].foundJob.GirtsFrontBack[0].k8top.toFixed(2),
      k8topGSide: job[0].foundJob.GirtsSides[0].k8top.toFixed(2),
      k8topSides: job[0].foundJob.IntermediateSIDES[0].k8top.toFixed(2),
      s1up: job[0].foundJob.PProperties[0].s1up.toFixed(2),
      s1upRI: job[0].foundJob.RafterCapacity[0].s1up.toFixed(2),
      s1upRE: job[0].foundJob.RafterCapacityE[0].s1up.toFixed(2),
      s1upFB: job[0].foundJob.IntermediateFrontBack[0].s1up.toFixed(2),
      s1upGFB: job[0].foundJob.GirtsFrontBack[0].s1up.toFixed(2),
      s1upGSide: job[0].foundJob.GirtsSides[0].s1up.toFixed(2),
      s1upSides: job[0].foundJob.IntermediateSIDES[0].s1up.toFixed(2),
      s1down: job[0].foundJob.PProperties[0].s1down.toFixed(2),
      s1downRI: job[0].foundJob.RafterCapacity[0].s1down.toFixed(2),
      s1downRE: job[0].foundJob.RafterCapacityE[0].s1down.toFixed(2),
      s1downFB: job[0].foundJob.IntermediateFrontBack[0].s1down.toFixed(2),
      s1downGFB: job[0].foundJob.GirtsFrontBack[0].s1down.toFixed(2),
      s1downGSide: job[0].foundJob.GirtsSides[0].s1down.toFixed(2),
      s1downSides: job[0].foundJob.IntermediateSIDES[0].s1down.toFixed(2),
      shearStress: job[0].foundJob.PProperties[0].ShearStress,
      shearStressRI: job[0].foundJob.RafterCapacity[0].ShearStress,
      shearStressRE: job[0].foundJob.RafterCapacityE[0].ShearStress,
      shearStressFB: job[0].foundJob.IntermediateFrontBack[0].ShearStress,
      shearStressGFB: job[0].foundJob.GirtsFrontBack[0].ShearStress,
      shearStressGSide: job[0].foundJob.GirtsSides[0].ShearStress,
      shearStressSides: job[0].foundJob.IntermediateSIDES[0].ShearStress,
      BendingStress: job[0].foundJob.PProperties[0].BendingStress,
      BendingStressRI: job[0].foundJob.RafterCapacity[0].BendingStress,
      BendingStressRE: job[0].foundJob.RafterCapacityE[0].BendingStress,
      BendingStressFB: job[0].foundJob.IntermediateFrontBack[0].BendingStress,
      BendingStressGFB: job[0].foundJob.GirtsFrontBack[0].BendingStress,
      BendingStressGSide: job[0].foundJob.GirtsSides[0].BendingStress,
      BendingStressSides:
        job[0].foundJob.IntermediateFrontBack[0].BendingStress,
      MnuShortIB: job[0].foundJob.IntermediateFrontBack[0].Mnushort,
      MnuShortSi: job[0].foundJob.IntermediateSIDES[0].Mnushort,
      MnuShortGFB: job[0].foundJob.GirtsFrontBack[0].Mnushort,
      MnuShortGSide: job[0].foundJob.GirtsSides[0].Mnushort,
      MApplied: job[0].foundJob.IntermediateFrontBack[0].MApplied,
      MAppliedSide: job[0].foundJob.IntermediateSIDES[0].MApplied,
      MAppliedGFB: job[0].foundJob.GirtsFrontBack[0].MApplied,
      MAppliedGSide: job[0].foundJob.GirtsSides[0].MApplied,
      moisture: job[0].foundJob.PProperties[0].moisture,
      Dl: job[0].foundJob.PAnalysis[0].Dl,
      Ll: job[0].foundJob.PAnalysis[0].Ll,
      PSpan: job[0].foundJob.PAnalysis[0].PSpan,
      pSpacing: job[0].foundJob.PAnalysis[0].pSpacing,
      RSpacingI: job[0].foundJob.PAnalysis[0].RSpacingI,
      RSpacingE: job[0].foundJob.PAnalysis[0].RSpacingE,
      InspacingFB: job[0].foundJob.IntermediateFrontBack[0].bayWidth,
      GSpacingFB: job[0].foundJob.GirtsFrontBack[0].spacing,
      GSpacingSides: job[0].foundJob.GirtsSides[0].spacing,
      InspacingSides: job[0].foundJob.IntermediateSIDES[0].bayWidth * 1000,
      RSpanI: job[0].foundJob.PAnalysis[0].RSpanI,
      RSpanE: job[0].foundJob.PAnalysis[0].RSpanE,
      ISpanFB: job[0].foundJob.IntermediateFrontBack[0].Span,
      GSpanFB: job[0].foundJob.GirtsFrontBack[0].Span,
      GSpanSides: job[0].foundJob.GirtsSides[0].Span,
      ISpanSides: job[0].foundJob.IntermediateSIDES[0].Span,
      RSize: job[0].foundJob.RafterCapacity[0].member,
      RESize: job[0].foundJob.RafterCapacityE[0].member,
      reactiondown: job[0].foundJob.PAnalysis[0].reaction,
      reactiondownRI: job[0].foundJob.PAnalysis[0].reactionRI,
      reactiondownRE: job[0].foundJob.PAnalysis[0].reactionRE,
      reactionup: job[0].foundJob.PAnalysis[0].reactionup,
      reactionupRI: job[0].foundJob.PAnalysis[0].reactionupRI,
      reactionupRE: job[0].foundJob.PAnalysis[0].reactionupRE,
      reactionupFB: job[0].foundJob.IntermediateFrontBack[0].reaction,
      reactionupGFB: job[0].foundJob.GirtsFrontBack[0].reaction,
      reactionupGSide: job[0].foundJob.GirtsSides[0].reaction,
      reactionupSides: job[0].foundJob.IntermediateSIDES[0].reaction,
      member: job[0].foundJob.PProperties[0].member,
      memberRI: job[0].foundJob.RafterCapacity[0].member,
      memberRE: job[0].foundJob.RafterCapacityE[0].member,
      memberIFB: job[0].foundJob.IntermediateFrontBack[0].member,
      memberGFB: job[0].foundJob.GirtsFrontBack[0].member,
      memberGSide: job[0].foundJob.GirtsSides[0].member,
      memberISides: job[0].foundJob.IntermediateSIDES[0].member,
      Mcondition: job[0].foundJob.PProperties[0].MCondition,
      MconditionRI: job[0].foundJob.RafterCapacity[0].MCondition,
      MconditionRE: job[0].foundJob.RafterCapacityE[0].MCondition,
      MconditionFB: job[0].foundJob.IntermediateFrontBack[0].MCondition,
      MconditionGFB: job[0].foundJob.GirtsFrontBack[0].MCondition,
      MconditionGSide: job[0].foundJob.GirtsSides[0].MCondition,
      MconditionSides: job[0].foundJob.IntermediateSIDES[0].MCondition,
      windLoad: job[0].foundJob.PAnalysis[0].windup,
      SnowDown: job[0].foundJob.PAnalysis[0].SnowDown,
      vshort: job[0].foundJob.PAnalysis[0].vshort,
      vshortRI: job[0].foundJob.PAnalysis[0].vshortRI,
      vshortRE: job[0].foundJob.PAnalysis[0].vshortRE,
      vshortFB: job[0].foundJob.IntermediateFrontBack[0].reaction,
      vshorGFB: job[0].foundJob.GirtsFrontBack[0].reaction,
      vshorGSide: job[0].foundJob.GirtsSides[0].reaction,
      vshortSides: job[0].foundJob.IntermediateSIDES[0].reaction,
      vmedium: job[0].foundJob.PAnalysis[0].vmedium,
      vmediumRI: job[0].foundJob.PAnalysis[0].vmediumRI,
      vmediumRE: job[0].foundJob.PAnalysis[0].vmediumRE,
      vlong: job[0].foundJob.PAnalysis[0].vlong,
      vlongRI: job[0].foundJob.PAnalysis[0].vlongRI,
      vlongRE: job[0].foundJob.PAnalysis[0].vlongRE,
      shearShort: job[0].foundJob.PProperties[0].shearShort,
      shearShortRI: job[0].foundJob.RafterCapacity[0].shearShort,
      shearShortRE: job[0].foundJob.RafterCapacityE[0].shearShort,
      shearShortFB: job[0].foundJob.IntermediateFrontBack[0].shearShort,
      shearShortGFB: job[0].foundJob.GirtsFrontBack[0].shearShort,
      shearShortGSide: job[0].foundJob.GirtsSides[0].shearShort,
      shearShortSides: job[0].foundJob.IntermediateSIDES[0].shearShort,
      shearMedium: job[0].foundJob.PProperties[0].shearMedium,
      shearMediumRI: job[0].foundJob.RafterCapacity[0].shearMedium,
      shearMediumRE: job[0].foundJob.RafterCapacityE[0].shearMedium,
      shearLong: job[0].foundJob.PProperties[0].shearLong,
      shearLongRI: job[0].foundJob.RafterCapacity[0].shearLong,
      shearLongRE: job[0].foundJob.RafterCapacityE[0].shearLong,
      Per1v: Math.abs(
        (job[0].foundJob.PProperties[0].shearShort * 100) /
          job[0].foundJob.PAnalysis[0].vshort
      ).toFixed(2),
      Per1vRI: Math.abs(
        (job[0].foundJob.RafterCapacity[0].shearShort * 100) /
          job[0].foundJob.PAnalysis[0].vshortRI
      ).toFixed(2),
      Per1vRE: Math.abs(
        (job[0].foundJob.RafterCapacityE[0].shearShort * 100) /
          job[0].foundJob.PAnalysis[0].vshortRE
      ).toFixed(2),
      Per1vFB: Math.abs(
        (job[0].foundJob.IntermediateFrontBack[0].shearShort * 100) /
          job[0].foundJob.IntermediateFrontBack[0].reaction
      ).toFixed(2),
      Per1vSides: Math.abs(
        (job[0].foundJob.IntermediateSIDES[0].shearShort * 100) /
          job[0].foundJob.IntermediateSIDES[0].reaction
      ).toFixed(2),
      Per1vGFB: Math.abs(
        (job[0].foundJob.GirtsFrontBack[0].shearShort * 100) /
          job[0].foundJob.GirtsFrontBack[0].reaction
      ).toFixed(2),
      Per1vGSides: Math.abs(
        (job[0].foundJob.GirtsSides[0].shearShort * 100) /
          job[0].foundJob.GirtsSides[0].reaction
      ).toFixed(2),
      Per2v: (
        (job[0].foundJob.PProperties[0].shearMedium * 100) /
        job[0].foundJob.PAnalysis[0].vmedium
      ).toFixed(2),
      Per2vRI: (
        (job[0].foundJob.RafterCapacity[0].shearMedium * 100) /
        job[0].foundJob.PAnalysis[0].vmediumRI
      ).toFixed(2),
      Per2vRE: (
        (job[0].foundJob.RafterCapacityE[0].shearMedium * 100) /
        job[0].foundJob.PAnalysis[0].vmediumRE
      ).toFixed(2),
      Per3v: (
        (job[0].foundJob.PProperties[0].shearLong * 100) /
        job[0].foundJob.PAnalysis[0].vlong
      ).toFixed(2),
      Per3vRI: (
        (job[0].foundJob.RafterCapacity[0].shearLong * 100) /
        job[0].foundJob.PAnalysis[0].vlongRI
      ).toFixed(2),
      Per3vRE: (
        (job[0].foundJob.RafterCapacityE[0].shearLong * 100) /
        job[0].foundJob.PAnalysis[0].vlongRE
      ).toFixed(2),
      deflong: job[0].foundJob.PProperties[0].deflong,
      deflongRI: job[0].foundJob.RafterCapacity[0].deflong,
      deflongRE: job[0].foundJob.RafterCapacityE[0].deflong,
      defshort: job[0].foundJob.PProperties[0].defshort,
      defshortRI: job[0].foundJob.RafterCapacity[0].defshort,
      defshortRE: job[0].foundJob.RafterCapacityE[0].defshort,
      defshortFB: job[0].foundJob.IntermediateFrontBack[0].defshort,
      defshortGFB: job[0].foundJob.GirtsFrontBack[0].defshort,
      defshortGSide: job[0].foundJob.GirtsSides[0].defshort,
      defshortSides: job[0].foundJob.IntermediateSIDES[0].defshort,
      E: job[0].foundJob.PProperties[0].E,
      ERI: job[0].foundJob.RafterCapacity[0].E,
      ERE: job[0].foundJob.RafterCapacityE[0].E,
      EFB: job[0].foundJob.IntermediateFrontBack[0].E,
      ESides: job[0].foundJob.IntermediateSIDES[0].E,
      EGFB: job[0].foundJob.GirtsFrontBack[0].E,
      EGSide: job[0].foundJob.GirtsSides[0].E,
      k2long: job[0].foundJob.PProperties[0].k2long,
      k2longRI: job[0].foundJob.RafterCapacity[0].k2long,
      k2longRE: job[0].foundJob.RafterCapacityE[0].k2long,
      Deflimit: job[0].foundJob.PProperties[0].Deflimit,
      DeflimitRI: job[0].foundJob.RafterCapacity[0].Deflimit,
      DeflimitRE: job[0].foundJob.RafterCapacityE[0].Deflimit,
      Deflimitwn: job[0].foundJob.PProperties[0].Deflimitwn,
      DeflimitwnFB: job[0].foundJob.IntermediateFrontBack[0].Deflimitwn,
      DeflimitwnGFB: job[0].foundJob.GirtsFrontBack[0].Deflimitwn,
      DeflimitwnGSide: job[0].foundJob.GirtsSides[0].Deflimitwn,
      DeflimitwnSides: job[0].foundJob.IntermediateSIDES[0].Deflimitwn,
      DeflimitwnRI: job[0].foundJob.RafterCapacity[0].Deflimitwn,
      DeflimitwnRE: job[0].foundJob.RafterCapacityE[0].Deflimitwn,
      display: job[0].foundJob.IntermediateFrontBack[0].display,
      displaySIDES: job[0].foundJob.IntermediateSIDES[0].display,
      displayGFb: job[0].foundJob.GirtsFrontBack[0].display,
      displaySides: job[0].foundJob.GirtsSides[0].display,
      Eq: job[0].foundJob.EqZone,
      Db: job[0].foundJob.DZone,
      RafterIDisplay: job[0].foundJob.RafterCapacity[0].display,
      PoleDesignInternal: job[0].foundJob.PoleDesignInternal[0],
      PoleDesignExternal: job[0].foundJob.PoleDesignExternal[0],
      GirtsFrontBack: job[0].foundJob.GirtsFrontBack[0],
      GirtsSide: job[0].foundJob.GirtsSides[0],
      RafterCapacity: job[0].foundJob.RafterCapacity[0],
      RafterCapacityE: job[0].foundJob.RafterCapacityE[0],
      PAnalysis: job[0].foundJob.PAnalysis[0],
      IntermediateFrontBack: job[0].foundJob.IntermediateFrontBack[0],
      windCategory:job[0].foundJob.windCategory
    },
  ];

  const document = {
    html: html,
    data: {
      users: dt,
    },
    path: "./docs/" + filename,
    type: "",
  };

  pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });

  const filepath = "/docs/" + filename;

  res.render("download", {
    path: filepath,
  });
};

module.exports = {
  generatePdf,
};
