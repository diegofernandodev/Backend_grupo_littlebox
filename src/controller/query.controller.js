const queryModel = require("../models/query.model")
const { ResponseStructure } = require("../helpers/ResponseStructure");
const { responseEdit } = require("../helpers/response.edit");



const controller = {}

//Show a single query:
controller.getAQuery = async (req, res) => {
  
  try {
     
    const tenantId = req.tenantId
    const id = req.params.id
    const query = await queryModel.findById({_id: id, tenantId: tenantId})
    
    if (!query) {
      ResponseStructure.status = "500";
      ResponseStructure.message = "The query does not exist.";
      ResponseStructure.data = error;
      res.status(404).send(ResponseStructure);
    }
    
    res.status(200).send(query);


  }catch(err){
    console.error('Search error:',err);
    ResponseStructure.status = "500";
    ResponseStructure.message = "Could not be found correctly.";
    ResponseStructure.data = error;
    res.status(500).send(ResponseStructure);
  }
}

//Edit query:
controller.editQuery = async (req, res) => {
  try {
      const id = req.params.id;
      const edited = req.body;
      const tenantId = req.tenantId;

      const query = await queryModel.findOneAndUpdate({ _id: id, tenantId: tenantId }, edited, { new: true });

      if (!query) {
          return res.status(404).json({ status: 404, message: "Query not found or does not belong to the current tenant." });
      }

      const responseEdit = {
          status: "200",
          message: "It has been edited successfully.",
          former: query,
          edited: edited
      };

      res.status(200).send(responseEdit);
  } catch (error) {
      console.error('Error occurred while editing query:', error);

      const ResponseStructure = {
          status: "500",
          message: "Could not update correctly.",
          data: error
      };

      res.status(500).send(ResponseStructure);
  }
}

//Show of all queries:
controller.showQueries = async (req, res) => {
  
  try{
    const tenantId = req.tenantId
    const queries = await queryModel.find({ tenantId }).populate('subcategory', 'name');
    res.json(queries)

  }catch(err){
    ResponseStructure.status = "500"
    ResponseStructure.message = "It could not be found."
    ResponseStructure.data = error
    res.status(500).send(ResponseStructure);
  }
}

let queryCounter = 1; 

//Save query:
controller.saveQuery = async (req, res) => {
  try {
    
    const lastQuery = await queryModel.findOne({ tenantId: req.tenantId }).sort({ identifier: -1 });
    if (lastQuery) {
      queryCounter = lastQuery.identifier + 1;
    }

    const body = req.body;
    body.identifier = queryCounter;
    body.tenantId = req.tenantId;


    const newQuery = new queryModel(body);
    await newQuery.save();

  
    queryCounter++;

    ResponseStructure.status = 200;
    ResponseStructure.message = "The query has been saved successfully.";
    ResponseStructure.data = body;

    res.status(200).send(ResponseStructure);
  } catch (error) {
    const errorsCatch = error.errors;
    const errors = {};

    for (let i in errorsCatch) {
      errors[i] = errorsCatch[i].message;
    }

    ResponseStructure.status = 500;
    ResponseStructure.message = "An error occurred, the query could not be saved.";
    ResponseStructure.data = errors;

    res.status(500).json(ResponseStructure);
  }
}
//Delete query:
controller.deleteQuery = async (req, res) => {
  try {
    const idParam = req.params.id;
    const tenantId = req.tenantId;
    
    const removedQuery = await queryModel.findOneAndDelete({ _id: idParam, tenantId: tenantId });
    
    if (!removedQuery) {
      return res.status(404).json({ status: 404, message: "Query not found or does not belong to the current tenant." });
    }


    const queriesToUpdate = await queryModel.find({ identifier: { $gt: removedQuery.identifier }, tenantId: tenantId });   
    
    for (const query of queriesToUpdate) {
      query.identifier -= 1;
      await query.save();
    }

  
    ResponseStructure.status = 200;
    ResponseStructure.message = "The query has been successfully removed.";
    ResponseStructure.data = removedQuery;
    res.status(200).send(ResponseStructure);
  } catch (error) {
    console.error('Error occurred while deleting query:', error);
    // Respuesta de error
    ResponseStructure.status = 500;
    ResponseStructure.message = "Could not delete the query correctly.";
    ResponseStructure.data = error;
    res.status(500).send(ResponseStructure);
  }
}


//Show query by identifier:
controller.getQueryByNumber = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const tenantId = req.tenantId
    console.log(tenantId);
  
    const query = await queryModel.findOne({ identifier: identifier, tenantId: tenantId });

    
    if (!query || !query.identifier || !query.question || !query.answer || !query.subcategory) {
      ResponseStructure.status = 404;
      ResponseStructure.message = "The query does not exist or has an invalid format.";
      ResponseStructure.data = null;
      return res.status(404).json(ResponseStructure);
    }

   
    ResponseStructure.status = 200;
    ResponseStructure.message = "Query found.";
    ResponseStructure.data = query;
    res.status(200).json(ResponseStructure);
  } catch (err) {
    console.error('Search error:', err);
    ResponseStructure.status = 500;
    ResponseStructure.message = "An error occurred while searching for the query.";
    ResponseStructure.data = err;
    res.status(500).json(ResponseStructure);
  }
}


//Get query for subcategory id:
  controller.getQueriesBySubcategory = async (req, res) => {
    try {
      const identifier = req.params.identifier;
      const tenantId = req.tenantId
      const queries = await queryModel.find({ subcategory: identifier, tenantId: tenantId });
  
      res.status(200).json(queries);
      
    } catch (error) {
      console.error('Search error:', err);
      ResponseStructure.status = "500";
      ResponseStructure.message = "Could not be found correctly.";
      ResponseStructure.data = err;
      res.status(500).send(ResponseStructure);
    }
  };


//chatBack: 
//Show queries whitout tenant: 
controller.queriesWhitoutTenant = async (req, res) => {
  try {
    const queries = await queryModel.find({ $or: [{ tenantId: { $exists: false } }, { tenantId: null }]});

    res.json(queries);
  } catch (error) {
    ResponseStructure.status = "500"
    ResponseStructure.message = "It could not be found."
    ResponseStructure.data = error
    res.status(500).send(ResponseStructure);
  }
}

//A Query: 
controller.getQueryWT = async (req, res) => {
  try {
    const query = await queryModel.findOne({ tenantId: { $exists: false } });
    
    if (!query) {
      const ResponseStructure = {
        status: 404,
        message: "The query does not exist."
      };
      return res.status(404).json(ResponseStructure);
    }
    
    res.status(200).json(query);
  } catch (error) {
    console.error('Search error:', error);
    const ResponseStructure = {
      status: 500,
      message: "Could not be found correctly.",
      data: error
    };
    res.status(500).json(ResponseStructure);
  }
}

//Edit query wt: 
controller.editQueryWT = async (req, res) => {
  try {
      const id = req.params.id;
      const edited = req.body;

      const query = await queryModel.findOneAndUpdate({ _id: id }, edited, { new: true });

      if (!query) {
          return res.status(404).json({ status: 404, message: "Query not found." });
      }

      const responseEdit = {
          status: "200",
          message: "Query has been edited successfully.",
          former: query,
          edited: edited
      };

      res.status(200).send(responseEdit);
  } catch (error) {
      console.error('Error occurred while editing query:', error);

      const ResponseStructure = {
          status: "500",
          message: "Could not update correctly.",
          data: error
      };

      res.status(500).send(ResponseStructure);
  }
}

//Get query for subcategory id:
controller.getQueriesBySubcategoryWT = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const queries = await queryModel.find({ subcategory: identifier, $or: [{ tenantId: { $exists: false } }, { tenantId: null }] });

    res.status(200).json(queries);
    
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    const ResponseStructure = {
      status: "500",
      message: "No se pudieron encontrar las consultas correctamente.",
      data: error
    };
    res.status(500).send(ResponseStructure);
  }
};

let queryCounters = 0; 

//Save WT
controller.saveQueryWT = async (req, res) => {
  try {
    const lastQuery = await queryModel.findOne().sort({ identifier: -1 });
    
    if (lastQuery) {
      queryCounters = lastQuery.identifier + 1;
    }

    const body = req.body;
    body.identifier = queryCounters;

    const newQuery = new queryModel(body);
    await newQuery.save();

    const ResponseStructure = {
      status: 200,
      message: "The query has been saved successfully.",
      data: body
    };

    res.status(200).send(ResponseStructure);
  } catch (error) {
    const errorsCatch = error.errors;
    const errors = {};

    for (let i in errorsCatch) {
      errors[i] = errorsCatch[i].message;
    }

    const ResponseStructure = {
      status: 500,
      message: "An error occurred, the query could not be saved.",
      data: errors
    };

    res.status(500).json(ResponseStructure);
  }
};

//DeleteWT
controller.deleteQueryWT = async (req, res) => {
  try {
    const idParam = req.params.id;

    const removedQuery = await queryModel.findOneAndDelete({ _id: idParam });
    
    if (!removedQuery) {
      return res.status(404).json({ status: 404, message: "Query not found." });
    }

    const queriesToUpdate = await queryModel.find({ identifier: { $gt: removedQuery.identifier } });   
    
    for (const query of queriesToUpdate) {
      query.identifier -= 1;
      await query.save();
    }

    const ResponseStructure = {
      status: 200,
      message: "The query has been successfully removed.",
      data: removedQuery
    };
    
    res.status(200).send(ResponseStructure);
  } catch (error) {
    console.error('Error occurred while deleting query:', error);
    
    const ResponseStructure = {
      status: 500,
      message: "Could not delete the query correctly.",
      data: error
    };
    
    res.status(500).send(ResponseStructure);
  }
};

//
controller.getQueryByNumberWT = async (req, res) => {
  try {
    const identifier = req.params.identifier;
  
    const query = await queryModel.findOne({ identifier: identifier, tenantId: { $exists: false } });
    
    if (!query || !query.identifier || !query.question || !query.answer || !query.subcategory) {
      const ResponseStructure = {
        status: 404,
        message: "The query does not exist or has an invalid format.",
        data: null
      };
      return res.status(404).json(ResponseStructure);
    }

    const ResponseStructure = {
      status: 200,
      message: "Query found.",
      data: query
    };
    res.status(200).json(ResponseStructure);
  } catch (err) {
    console.error('Search error:', err);
    const ResponseStructure = {
      status: 500,
      message: "An error occurred while searching for the query.",
      data: err
    };
    res.status(500).json(ResponseStructure);
  }
}

  
module.exports = controller