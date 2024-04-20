const queryModel = require("../models/query.model")
const SubcategoryModel = require('../models/subcategory.model');
const { ResponseStructure } = require("../helpers/ResponseStructure");
const { responseEdit } = require("../helpers/response.edit");



const controller = {}

//Show a single query:
controller.getAQuery = async (req, res) => {

  try {

    const tenantId = req.tenantId
    const id = req.params.id
    const query = await queryModel.findById({ _id: id, tenantId: tenantId })

    if (!query) {
      ResponseStructure.status = "500";
      ResponseStructure.message = "The query does not exist.";
      ResponseStructure.data = error;
      res.status(404).send(ResponseStructure);
    }

    res.status(200).send(query);


  } catch (err) {
    console.error('Search error:', err);
    ResponseStructure.status = "500";
    ResponseStructure.message = "Could not be found correctly.";
    ResponseStructure.data = error;
    res.status(500).send(ResponseStructure);
  }
}



//Show of all queries:
controller.showQueries = async (req, res) => {

  try {
    const tenantId = req.tenantId
    const queries = await queryModel.find({ tenantId }).populate('subcategory', 'name');
    res.json(queries)

  } catch (err) {
    ResponseStructure.status = "500"
    ResponseStructure.message = "It could not be found."
    ResponseStructure.data = error
    res.status(500).send(ResponseStructure);
  }
}


let queryCounter = 2.001;

// Save query
controller.saveQuery = async (req, res) => {
  try {
    const { tenantId } = req;

    const lastQuery = await queryModel.findOne({ tenantId }).sort({ identifier: -1 });

    if (lastQuery && typeof lastQuery.identifier === 'number') {
      
      let nextCounter = lastQuery.identifier + 0.001;
      queryCounter = parseFloat(nextCounter.toFixed(3));
    }

    const body = req.body;
    body.identifier = queryCounter;
    body.tenantId = tenantId;

    const newQuery = new queryModel(body);
    await newQuery.save();

    const ResponseStructure = {
      status: 200,
      message: "The query has been saved successfully.",
      data: body
    };

    res.status(200).json(ResponseStructure);
  } catch (error) {
    console.error('An error occurred, the query could not be saved:', error);
    const ResponseStructure = {
      status: 500,
      message: "An error occurred, the query could not be saved.",
      error: error.message
    };
    res.status(500).json(ResponseStructure);
  }
};

// Controlador para eliminar la consulta
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
      query.identifier -= 0.001;
      query.identifier = parseFloat(query.identifier.toFixed(3));
      await query.save();
    }

    const ResponseStructure = {
      status: 200,
      message: "The query has been successfully removed.",
      data: removedQuery
    };
    res.status(200).json(ResponseStructure);
  } catch (error) {
    console.error('Error occurred while deleting query:', error);
    const ResponseStructure = {
      status: 500,
      message: "Could not delete the query correctly.",
      data: error
    };
    res.status(500).json(ResponseStructure);
  }
};


//Edit query
controller.editQuery = async (req, res) => {
  try {
    const id = req.params.id;
    const editedQuery = req.body;
    const tenantId = req.tenantId;


    const originalQuery = await queryModel.findOne({ _id: id, tenantId: tenantId });

    if (!originalQuery) {
      return res.status(404).json({ status: 404, message: "Query not found or does not belong to the current tenant." });
    }


    const originalIdentifier = originalQuery.identifier;


    delete editedQuery.identifier;


    const updatedQuery = await queryModel.findOneAndUpdate({ _id: id, tenantId: tenantId }, editedQuery, { new: true });


    if (!updatedQuery) {
      return res.status(500).json({ status: 500, message: "Could not update correctly." });
    }

 
    const responseEdit = {
      status: 200,
      message: "The query has been edited successfully.",
      former: {
        ...originalQuery.toObject(),
        identifier: originalIdentifier 
      },
      edited: updatedQuery
    };

    res.status(200).json(responseEdit);
  } catch (error) {
    console.error('Error occurred while editing query:', error);
    const ResponseStructure = {
      status: 500,
      message: "Could not update correctly.",
      data: error
    };
    res.status(500).json(ResponseStructure);
  }
};

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
    const subcategoryName = req.params.subcategoryName;
    const tenantId = req.tenantId;

    const subcategory = await SubcategoryModel.findOne({ name: subcategoryName, tenantId: tenantId });

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    const queries = await queryModel.find({ subcategory: subcategory._id, tenantId: tenantId });

    res.status(200).json(queries);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//chatBack: 
//Show queries whitout tenant: 
controller.queriesWhitoutTenant = async (req, res) => {
  try {
    const queries = await queryModel.find({ $or: [{ tenantId: { $exists: false } }, { tenantId: null }] }).populate('subcategory', 'name');;

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

let queryCounters = 2.001;

// Save queryWT
controller.saveQueryWT = async (req, res) => {
  try {

    const lastQuery = await queryModel.findOne().sort({ identifier: -1 });

    if (lastQuery && typeof lastQuery.identifier === 'number') {
      
      let nextCounters = lastQuery.identifier + 0.001;
      queryCounters = parseFloat(nextCounters.toFixed(3));
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
    
    res.status(200).json(ResponseStructure);
  } catch (error) {
    console.error('An error occurred, the query could not be saved:', error);
    const ResponseStructure = {
      status: 500,
      message: "An error occurred, the query could not be saved.",
      error: error.message
    };
    res.status(500).json(ResponseStructure);
  }
};

//Delete queryWT
controller.deleteQueryWT = async (req, res) => {
  try {
    const idParam = req.params.id;

    const removedQuery = await queryModel.findOneAndDelete({ _id: idParam });

    if (!removedQuery) {
      return res.status(404).json({ status: 404, message: "Query not found or does not belong to the current tenant." });
    }
    const queriesToUpdate = await queryModel.find({ identifier: { $gt: removedQuery.identifier } });
    for (const query of queriesToUpdate) {
      query.identifier -= 0.001;
      query.identifier = parseFloat(query.identifier.toFixed(3));
      await query.save();
    }

    const ResponseStructure = {
      status: 200,
      message: "The query has been successfully removed.",
      data: removedQuery
    };

    res.status(200).json(ResponseStructure);
  } catch (error) {
    console.error('Error occurred while deleting query:', error);
    const ResponseStructure = {
      status: 500,
      message: "Could not delete the query correctly.",
      data: error
    };
    res.status(500).json(ResponseStructure);
  }
};


//Edit queryWT
controller.editQueryWT = async (req, res) => {
  try {
    const id = req.params.id;
    const editedQuery = req.body;

    const originalQuery = await queryModel.findOne({ _id: id });

    if (!originalQuery) {
      return res.status(404).json({ status: 404, message: "Query not found." });
    }

    const originalIdentifier = originalQuery.identifier;

    delete editedQuery.identifier;

    const updatedQuery = await queryModel.findOneAndUpdate({ _id: id }, editedQuery, { new: true });
   
    if (!updatedQuery) {
      return res.status(500).json({ status: 500, message: "Could not update correctly." });
    }

    const responseEdit = {
      status: 200,
      message: "The query has been edited successfully.",
      former: {
        ...originalQuery.toObject(),
        identifier: originalIdentifier 
      },
      edited: updatedQuery
    };

    res.status(200).json(responseEdit);
  } catch (error) {

    console.error('Error occurred while editing query:', error);
    const ResponseStructure = {
      status: 500,
      message: "Could not update correctly.",
      data: error
    };
    res.status(500).json(ResponseStructure);
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