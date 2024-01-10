
import charts from "./charts.js";
import getOptimizationModels from "./models.js";
import appendEventHandlers from "./requestHandlers.js";




Edrys.onReady(()=>{
    if(Edrys.role!=="station"){
        const username=Edrys.username;
        console.log("non station index");

        Edrys.onMessage(({from, subject, body})=>onEdrysMessage(from, subject, body));

        const onEdrysMessage=(from, subject, body)=>{
            if(from==username) return;
            const msg=JSON.parse(body);
            if(msg.topic==="dataUpdate") onDataUpdate(msg);
        
        }

        const onDataUpdate=(msg)=>{
            console.log("data update");
            const modelTopic=msg.subTopic;
            const model=getModel(modelTopic);
            if(model==undefined){
                console.debug("No known model by the topic "+modelTopic);
                return;
            }
            model.appendValues(msg.data);
        }
        
        const getModel=topic=>models.filter(m=>m.topic===topic)[0];

        const setChartUpdates=(intervalMS)=>{
            const interval=setInterval(()=>{
                for(const chart of charts) chart.update();
            }, intervalMS);

            return interval;
        }

        const models=getOptimizationModels();
        
        setChartUpdates(1000);

        appendEventHandlers();
       
        
        
        
    }
})







